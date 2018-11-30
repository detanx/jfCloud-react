export const COUNT = 100;
export const BASEPATH = "http://www.jfbiomed.com.cn:9527";
export const UNAMERE = /((?=[\x21-\x7e]+)[^A-Za-z0-9])/;//匹配用户名
export const PWDRE = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/;//匹配密码
export const PHONERE = /^1[34578]\d{9}$/
export const EMAILRE = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
