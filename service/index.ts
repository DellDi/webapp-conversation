import axios, { AxiosHeaders } from 'axios'

import type {
  IOnCompleted,
  IOnData,
  IOnError,
  IOnFile,
  IOnMessageEnd,
  IOnMessageReplace,
  IOnNodeFinished,
  IOnNodeStarted,
  IOnThought,
  IOnWorkflowFinished,
  IOnWorkflowStarted,
} from './base'
import { get, post, ssePost } from './base'
import type { Feedbacktype, ParametersRes } from '@/types/app'
import { API_URL } from '@/config'

export const sendChatMessage = async (
  body: Record<string, any>,
  {
    onData,
    onCompleted,
    onThought,
    onFile,
    onError,
    getAbortController,
    onMessageEnd,
    onMessageReplace,
    onWorkflowStarted,
    onNodeStarted,
    onNodeFinished,
    onWorkflowFinished,
  }: {
    onData: IOnData
    onCompleted: IOnCompleted
    onFile: IOnFile
    onThought: IOnThought
    onMessageEnd: IOnMessageEnd
    onMessageReplace: IOnMessageReplace
    onError: IOnError
    getAbortController?: (abortController: AbortController) => void
    onWorkflowStarted: IOnWorkflowStarted
    onNodeStarted: IOnNodeStarted
    onNodeFinished: IOnNodeFinished
    onWorkflowFinished: IOnWorkflowFinished
  },
) => {
  return ssePost('chat-messages', {
    body: {
      ...body,
      response_mode: 'streaming',
    },
  }, {
    onData,
    onCompleted,
    onThought,
    onFile,
    onError,
    getAbortController,
    onMessageEnd,
    onMessageReplace,
    onNodeStarted,
    onWorkflowStarted,
    onWorkflowFinished,
    onNodeFinished,
  })
}

export const fetchConversations = async () => {
  return get('conversations', { params: { limit: 100, first_id: '' } })
}

export const fetchChatList = async (conversationId: string) => {
  return get('messages', { params: { conversation_id: conversationId, limit: 20, last_id: '' } })
}

// 添加接口相应类型 ParametersRes
export const fetchAppParams = async (): Promise<ParametersRes> => {
  const response = await get('parameters')
  return response as ParametersRes
}

export const updateFeedback = async ({ url, body }: { url: string; body: Feedbacktype }) => {
  return post(url, { body })
}

export const generationConversationName = async (id: string) => {
  return post(`conversations/${id}/name`, { body: { auto_generate: true } })
}

interface Organization {
  organizationNature: string;
  organizationId: string;
  childOrganizations?: Organization[];
}

const commonFetch = async (url: string, method: string, headers: HeadersInit, body?: any) => {
  const axiosHeaders = new AxiosHeaders()
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      axiosHeaders.set(key, value)
    })
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      axiosHeaders.set(key, value)
    })
  } else {
    Object.entries(headers).forEach(([key, value]) => {
      axiosHeaders.set(key, value)
    })
  }

  const options = {
    method,
    headers: axiosHeaders,
    data: null,
  }
  if (body) {
    options.data = body
  }
  try {
    const response = await axios(url, options)
    if (!response.status || response.status >= 400) {
      return new Error(`HTTP error! status: ${response.status}`)
    }
    return response.data.resultData
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}
export const fetchAllProjectName = async (token: string) => {
  const urlObj = new URL(API_URL)
  const baseURl = `${urlObj.protocol}//${urlObj.hostname}`
  const url = new URL(`${baseURl}/api/view/organization/get-orgtree-form-standard`)
  const baseHeader = {
    token,
    appclienttype: 'mb',
    appid: '4ce19ca8fcd150a4',
  }
  url.searchParams.append('dimon', 'adm')
  url.searchParams.append('selectAll', 'false')
  const projectIds: string[] = []
  try {
    const organizationVos = await commonFetch(url.toString(), 'GET', baseHeader)
    const orgTree = organizationVos.organizationVos
    // 递归查找 orgTree 中的所有项目 id
    const findProjectIds = (tree: Organization[]) => {
      if (tree && tree.length === 0)
        return
      for (const item of tree) {
        if (item.organizationNature === 'propertyProject') {
          projectIds.push(item.organizationId)
        } else {
          item?.childOrganizations &&
          findProjectIds(item.childOrganizations)
        }
      }
    }
    findProjectIds(orgTree)
  } catch (error) {
    console.log('🚀 ~ file:index.ts, line:115-----', error)
  }
  // getPrecinctInfoByRefOrgIdList \ getPrecinctByOrgIds
  const url2 = new URL(`${baseURl}/api/owner/owner-rest/getPrecinctByOrgIdsAndPrecinctformat`)
  const resPriceList = await commonFetch(url2.toString(), 'POST', baseHeader, projectIds) as [{
    orgId: number;
    precinctId: number;
    precinctName: string
  }]
  return resPriceList.map(item => item.precinctName)
}

export const replaceArrText = (arr: string[], precinctNameList: string[]): string[] => {
  // 替换数组中的每一个文本包含${projectName}字符串,取 precinctNameList 中的随机值
  return arr.map((item) => {
    if (item.includes('${projectName}')) {
      const randomIndex = Math.floor(Math.random() * precinctNameList.length)
      return item.replace('${projectName}', precinctNameList[randomIndex])
    }
    return item
  })
}
