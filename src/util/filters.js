// import Vue from 'vue'
// import moment from 'moment'
//
// const time = (value, formatString = 'YYYY-MM-DD HH:mm') => {
//   return moment(parseInt(value) * 1000).format(formatString)
// }
//
// Vue.filter('time', time)
//
// export default Vue
// import moment from 'moment'
//
// const time = (value, formatString = 'YYYY-MM-DD HH:mm') => {
//   return moment(parseInt(value) * 1000).format(formatString)
// }
// export {time}

export function formatTime (time) {
  const date = new Date(time)
  const now = Date.now()

  const diff = (now - date) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }

  let y = date.getFullYear()
  let MM = date.getMonth() + 1
  MM = MM < 10 ? '0' + MM : MM
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let m = date.getMinutes()
  m = m < 10 ? '0' + m : m
  // eslint-disable-next-line no-unused-vars
  let s = date.getSeconds()
  s = s < 10 ? '0' + s : s
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m
}
