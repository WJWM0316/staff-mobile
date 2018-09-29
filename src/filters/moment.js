// ======== 时间相关过滤器 ========
// 所有时间戳单位精确到毫秒

import Vue from 'vue'
import moment from 'moment'

moment.locale('zh-cn')

/**
 * 日期过滤
 */
Vue.filter('date', (value, format = 'YYYY-MM-DD HH:mm:ss') => moment(value).format(format))
// MMMDo h:mm  x月x日 xx:xx
// moment().format('L');    // 2018-09-26
// moment().format('LL');   // 2018年9月26日

/**
 * 时间段过滤器
 */
Vue.filter('duration', timestamp => {
  const duration = moment.duration(timestamp)
  const days = duration.days()
  const hours = duration.hours()
  const minutes = duration.minutes()
  const seconds = duration.seconds()
  const asDays = Math.floor(duration.asDays())
  // const asHours = Math.floor(duration.asHours())
  // const asMinutes = Math.floor(duration.asMinutes())
  const format = (val, length = 2) => {
    var prefix = new Array(length + 1).join(0)
    return (prefix + val).substr(val.toString().length)
  }
  let result = 'D天 hh:mm:ss'
  let option = {
    'D+': asDays,
    'h+': hours,
    'm+': minutes,
    's+': seconds
  }
  for (let key of Object.keys(option)) {
    const value = option[key]
    if (new RegExp('(' + key + ')').test(result)) {
      result = result.replace(RegExp.$1, RegExp.$1.length === 1 ? value : format(value, RegExp.$1.length))
    }
  }
  return result
})

/**
 * 活跃时间
 */
Vue.filter('activeTime', timestamp => {
  let releaseTime = timestamp || 0
  const now = this.serverTime ? new Date(this.serverTime * 1000) : new Date()
  let timeStr = '刚刚'
  if (releaseTime) {
    releaseTime = new Date(releaseTime * 1000)
    let differ = parseInt((now.getTime() - releaseTime.getTime()) / 1000)
    const timeCompany = {
      m: 60,
      h: 60 * 60,
      d: 60 * 60 * 24
    }

    // 是否跨年 and 超过两天
    const nowDate = {
      y: now.getFullYear(),
      m: now.getMonth(),
      d: now.getDate()
    }
    const releaseTimeDate = {
      y: releaseTime.getFullYear(),
      m: releaseTime.getMonth(),
      d: releaseTime.getDate()
    }
    // 是否当天
    if (nowDate.y === releaseTimeDate.y && nowDate.m === releaseTimeDate.m && nowDate.d === releaseTimeDate.d) {
      if (differ < timeCompany.m) { // 一分钟以内
        timeStr = '刚刚'
      } else if (differ < timeCompany.h) { // 一小时以内
        timeStr = parseInt(differ / timeCompany.m) + '分钟前'
      } else {
        timeStr = parseInt(differ / timeCompany.h) + '小时前'
      }
    } else {
      differ = parseInt((new Date(nowDate.y, nowDate.m, nowDate.d).getTime() - releaseTime.getTime()) / 1000)
      if (differ < timeCompany.d) { // 昨天
        timeStr = '昨天'
      } else if (differ < timeCompany.d * 2) {
        timeStr = '前天'
      } else {
        if (now.getFullYear() > releaseTime.getFullYear()) { // 超过两天且跨年
          timeStr = moment(releaseTime).format('YY-MM-DD HH:mm')
        } else {
          timeStr = moment(releaseTime).format('MM-DD HH:mm')
        }
      }
    }
  }
  return timeStr
})

