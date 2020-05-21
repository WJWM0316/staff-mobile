export const PHONE = /0?(13|14|15|16|17|18|19)[0-9]{9}/ // 手机号验证
export const WECHAT = /^[-_a-zA-Z0-9]{6,20}$/ // 微信号验证
export const EMAIL = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/ // 邮箱验证
export const CHINESE = /^[\u4E00-\u9FA5]/ // 中文验证
export const URL = /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/ // 链接网址验证