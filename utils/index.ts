const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'

export function randomString(length: number) {
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

// 获取当前页面的url中的userName参数
export const getCustomUrlParams = () => {
  if (typeof window === 'undefined') {
    return {
      userName: 'delldi',
      token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZXdzZWUtc2hvdyIsImp0aSI6IjEwNzE4NSIsImlhdCI6MTcyOTY2NTIxN30.N4zcE0d8smw0RFCzHbBj5BF3Vq699HK7cVbSZ9PgfOU',
    }
  }
  const url = new URL(window.location.href)
  const userName = url.searchParams.get('userName')
  const token = url.searchParams.get('token')
  return {
    userName: userName || 'delldi',
    token: token || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZXdzZWUtc2hvdyIsImp0aSI6IjEwNzE4NSIsImlhdCI6MTcyOTY2NTIxN30.N4zcE0d8smw0RFCzHbBj5BF3Vq699HK7cVbSZ9PgfOU',
  }
}
