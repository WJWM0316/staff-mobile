export const PHONE = /0?(13|14|15|17|18|19)[0-9]{9}/ // 手机号验证
export const WECHAT = /^[-_a-zA-Z0-9]{6,20}$/ // 微信号验证
export const EMAIL = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/ // 邮箱验证
export const CHINESE = /^[\u4E00-\u9FA5]/ // 中文验证