<template>
  <transition name="slider">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>

</template>

<script>
// vuex 对取数据提供的语法糖
import { mapGetters } from "vuex";
import { getSingerDetail } from "../../api/singer";
import { ERR_OK } from "../../api/config";
import { createSong } from "../../common/js/song";
import MusicList from "../../components/music-list/music-list";
export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  created() {
    this._getDetail();
    this._normalizeSongs();
    // console.log(this.singer);
  },
  methods: {
    _getDetail() {
      // 刷新singer-detail页面 返回singer
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail(this.singer.id)
        .then(res => {
          if (res.code === ERR_OK) {
            // console.log(res.data.list);
            this.songs = this._normalizeSongs(res.data.list);
            // console.log(this.songs);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _normalizeSongs(list) {
      let ret = [];
      // 遍历之前要检查list是否存在，不然会报错：Cannot read property 'forEach' of undefined
      if (!list) {
        return;
      }
      list.forEach(item => {
        let { musicData } = item;
        // createSong必传两个参数
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';

.slider-enter-active, .slider-leave-active {
  transition: all 0.3s;
}

.slider-enter-active, .slider-leave-active {
  transform: translate3d(100%, 0, 0);
}
</style>
