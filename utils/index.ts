import { useTranslation } from 'react-i18next'

const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'

// 生成随机字符串
export function randomString(length: number) {
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

/**
 * 动态内容国际化处理Hook
 * 用于处理动态内容（如API返回数据）的国际化翻译
 * @returns 翻译函数，接收一个字符串参数，返回翻译后的字符串
 * @example
 * const translateName = useTranslationName();
 * return <div>{translateName(item.name)}</div>
 */
export const useTranslationName = () => {
  const { t } = useTranslation();

  return (name: string) => {
    // 检查是否是已知的需要翻译的字符串
    if (name === 'New conversation' || name === 'New Conversation') {
      return t('app.chat.newChatDefaultName');
    }

    // 可以添加更多需要翻译的特定字符串
    // 例如: if (name.startsWith('Project:')) { return t('app.project') + name.substring(8); }

    // 默认返回原始字符串
    return name;
  };
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