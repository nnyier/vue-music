// 抓取歌手数据
import jsonp from '../common/js/jsonp'
import {
  commonParams,
  options
} from './config'

// 歌手： https://y.qq.com/portal/singer_list.html
// export function getSingerList() {
//   const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
//   const data = Object.assign({}, commonParams, {
//     loginUin: 0,
//     hostUin: 0,
//     platform: 'yqq',
//     needNewCode: 0,
//     data: {
//       "comm": {
//         "ct": 24,
//         "cv": 10000
//       },
//       "singerList": {
//         "module": "Music.SingerListServer",
//         "method": "get_singer_list",
//         "param": {
//           "area": -100,
//           "sex": -100,
//           "genre": -100,
//           "index": -100,
//           "sin": 0,
//           "cur_page": 1
//         }
//       }
//     }
//   })
//   return jsonp(url, data, options)
// }
export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}
