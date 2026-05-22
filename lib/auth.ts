import Cookies from 'js-cookie'

const TOKEN_KEY = 'salary_token'

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY)
}

export function setToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, {
    expires: 1,          // 1 day — matches JWT 24h expiry
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production', // https only in prod
  })
}

export function removeToken(): void {
  Cookies.remove(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}