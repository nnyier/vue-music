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

export function createSong(musicData, songVkey) {
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
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=${songVkey}&guid=2254898176&uin=0&fromtag=66`
    // http://dl.stream.qqmusic.qq.com/C400003TfyNp47dm7E.m4a?vkey=CB3E581A3B78DEBA199D6FF2B843FB5EF1D34167F100F8C5546D2197DA6ABF109EB29CCE9D69A470BD4AFD4D40D37016D9DBDB33F40F5D3D&guid=2254898176&uin=0&fromtag=66
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
