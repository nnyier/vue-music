<template>
  <transition name="slider">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>

</template>

<script>
// vuex 对取数据提供的语法糖
import { mapGetters } from "vuex";
import { getSingerDetail, getMusic } from "../../api/singer";
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
            this.songs = this._normalizeSongs(res.data.list);
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
      // list.forEach(item => {
      //   let { musicData } = item;
      //   // createSong必传两个参数
      //   if (musicData.songid && musicData.albummid) {
      //     ret.push(createSong(musicData));
      //   }
      // console.log(list);
      list.forEach(item => {
        let { musicData } = item;
        // createSong必传两个参数
        if (musicData.songid && musicData.albummid) {
          getMusic(musicData.songmid).then(res => {
            if (res.code === ERR_OK) {
              const svkey = res.data.items;
              const songVkey = svkey[0].vkey;
              const newSong = createSong(musicData, songVkey);
              ret.push(newSong);
            }
          });
        }
      });
      // });
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
