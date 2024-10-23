const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
export function randomString(length: number) {
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}
// 获取当前页面的url中的userName参数
export const getCustomUrlParams = () => {
  const url = new URL(global.location.href)
  const userName = url.searchParams.get('userName')
  const token = url.searchParams.get('token')
  return {
    userName: userName || 'delldi',
    token: token || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZXdzZWUtc2hvdyIsImp0aSI6IjEwNzE4NSIsImlhdCI6MTcyOTY5MDUyNn0.yJQRuX_6u3eCwY4Glh97-6A9YJi7dD4ppo0yee9LmJU',
  }
}
