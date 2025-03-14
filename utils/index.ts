const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'

// 生成随机字符串
export function randomString(length: number) {
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

// 返回请求头
export const headersMap = {
  mb: {
    appId: '4ce19ca8fcd150a4',
    appClientType: 'mb',
  },
  pc: {
    appId: '07d8737811434732',
    appClientType: 'pc',
  },
}

// 返回请求头
export function returnAgentType() {
  // 检查 User-Agent
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

  // 检查触摸支持
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  // 使用更灵活的宽度判断
  const isScreenMobile = window.innerWidth <= 1024 // 可以根据需要调整

  return (isMobile || isTouchDevice || isScreenMobile) ? 'mb' : 'pc'
}