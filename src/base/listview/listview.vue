<template>
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll">
    <!-- 把scroll的data传入listview -->
    <ul>
      <li v-for="group in data" class="list-group" :key="group.id" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item" :key="item.id">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :class="{'current': currentIndex === index}" :key="index" :data-index="index" class="item">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from "../../base/scroll/scroll";
import { getData } from "../../common/js/dom";
import Loading from "../../base/loading/loading";
// 根据样式设置锚点高度
const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;

export default {
  // 在vue里，会监测data，props，computed的变化，以便跟dom映射
  created() {
    //  因为不需要观测touch的值，所以不需要放在data属性里
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  computed: {
    //   快速入口列表
    shortcutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    },
    // 滚动时，让对应title固定在列表顶部
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      // 判断是否有title
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  methods: {
    onShortcutTouchStart(ev) {
      // 获取数据
      let anchorIndex = getData(ev.target, "index");
      // 获取手指的位置
      let firstTouch = ev.touches[0];
      //   记录手指y的位置
      this.touch.y1 = firstTouch.pageY;
      //   当前点击时，锚点位置
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(ev) {
      // 手指移动时获取位置
      let firstTouch = ev.touches[0];
      this.touch.y2 = firstTouch.pageY;
      //   手指在y轴的偏移
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      //   锚点偏移
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    _scrollTo(index) {
      // 去除 快速入口首尾的点击事件
      if (!index && index !== 0) {
        return;
      }
      // 处理index边界
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        // 上限是最后一个元素
        index = this.listHeight.length - 2;
      }
      // 点击和滚动快速入口，高亮
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      //   循环遍历list,获取每一组的高度
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
        // scrollY和listHeight对比，就可以知道，移动落到哪个区间
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 滚动到顶部 newY > 0
      this.currentIndex = 0;
      // 在中间位置
      // scrollY和listHeight对比，就可以知道，移动落到哪个区间
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          // 处理 滚动时，两个title重合的情况
          this.diff = height2 + newY;
          return;
        }
      }
      // 滚动到底部，且-newY大于最后一个元素上限（当列表元素过少，没有铺满屏 ）
      this.currentIndex = listHeight.length - 2;
    },
    // 计算差值，让两个title 重合时，后者挤掉前者的效果
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      // 减少dom操作
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-content: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30px;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
