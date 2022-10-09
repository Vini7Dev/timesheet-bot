export const cookieParser = (headerCookies?: string): any => {
  if (!headerCookies) {
    return {}
  }

  const cookies = headerCookies.split(/;\s*/)

  const cookiesParsed: any = {}
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')
    cookiesParsed[key] = value
  }

  // Secure what has no undefined values
  return JSON.parse(JSON.stringify(cookiesParsed))
}
