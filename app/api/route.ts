import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // 获取请求的路由参数
    const { searchParams } = new URL(req.url)
    const userName = searchParams.get('userName')
    const token = searchParams.get('token')
    console.log('🚀 ~ file:route.ts, line:8-----', userName, token)
    // 处理你的逻辑
    return NextResponse.json({ message: 'Success' }, { status: 200 })
  } catch (error) {
    console.log('🚀 ~ file:route.ts, line:9-----', error)
    return NextResponse.json(
      { message: 'no params' },
      { status: 200 },
    )
  }
}
