import type { AppInfo } from '@/types/app'

export const APP_ID = `${process.env.NEXT_PUBLIC_APP_ID}`
export const API_KEY = `${process.env.NEXT_PUBLIC_APP_KEY}`
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const API_ORG_URL = `${process.env.NEXT_PUBLIC_API_ORG_URL}`

export const API_PATH = process.env.NEXT_PUBLIC_BASE_PATH

export const APP_INFO: AppInfo = {
  title: '驾驶舱小助手',
  description: '你的物业智慧服务小帮手',
  copyright: 'newsee',
  privacy_policy: '',
  default_language: 'zh-Hans',
}

export const isShowPrompt = true
export const promptTemplate = 'I want you to act as a javascript console.'

export const API_PREFIX = `${API_PATH}/api`

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
