<template>
    <div class="recommend">
        <!-- 抽象出来一个滚动组件，同时控制要滚动的元素 -->
        <scroll class="recommend-content" :data="disList" ref="scroll">
            <div>
                <div v-if="recommends.length" class="slider-wrapper">
                    <slide>
                        <div v-for="item in recommends" :key="item.id">
                            <a :href="item.linkUrl">
                                <!--fastclick遇到class="needsclick"就不会拦截click事件 -->
                                <img class="needsclick" @load="loadImage" :src="item.picUrl">
                            </a>
                        </div>
                    </slide>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li v-for="item in disList" :key="item.id" class="item">
                            <div class="icon">
                                <img v-lazy="item.imgurl" width="60" height="60">
                            </div>
                            <div class="text">
                                <h2 class="name" v-html="item.creator.name"></h2>
                                <p class="desc" v-html="item.dissname"></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container" v-show="!disList.length">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>

<script>
import Loading from "../../base/loading/loading";
import Scroll from "../../base/scroll/scroll";
import Slide from "../../base/slider/slide";
import { getRecommend, getDiscList } from "../../api/recommend";
import { ERR_OK } from "../../api/config";
export default {
  data() {
    return {
      recommends: [],
      disList: []
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.disList = res.data.list;
        }
      });
    },
    loadImage() {
      // 不需要每次加载图片都去调用refresh方法
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    }
  },
  components: {
    Slide,
    Scroll,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';

.recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;

    .recommend-content {
        height: 100%;
        overflow: hidden;

        .slider-wrapper {
            position: relative;
            width: 100%;
            overflow: hidden;
        }

        .recommend-list {
            .list-title {
                height: 65px;
                line-height: 65px;
                text-align: center;
                font-size: $font-size-medium;
                color: $color-theme;
            }

            .item {
                display: flex;
                box-sizing: border-box;
                align-content: center;
                padding: 0 20px 20px 20px;

                .icon {
                    flex: 0 0 60px;
                    width: 60px;
                    padding-right: 20px;
                }

                .text {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    flex: 1;
                    line-height: 20px;
                    overflow: hidden;
                    font-size: $font-size-medium;

                    .name {
                        margin-bottom: 10px;
                        color: $color-text;
                    }

                    .desc {
                        color: $color-text-d;
                    }
                }
            }
        }

        .loading-container {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}
</style>
