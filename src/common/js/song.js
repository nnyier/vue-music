export default class Song {
  constructor({
    id,
    mid,
    singer,
    name,
    album,
    duration,
    image,
    url
  }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    // name: musicData.name, 这里修改应该是songnanme
    album: musicData.albumname,
    duration: musicData.interval,
    // 数据结构发生变化 应该取得是mid 而不再是albummid
    image: `http://y.gtimg.cn/music/photo_new/T001R300x300M000${filterSingermid(musicData.singer)}.jpg?max_age=2592000`,
    url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return
  }
  singer.forEach((s) => {
    ret.push(s.name)
  });
  return ret.join('/')
}

function filterSingermid(singer) {
  let ret = []
  if (!singer) {
    return
  }
  singer.forEach((s) => {
    ret.push(s.mid)
  });
  return ret
}
