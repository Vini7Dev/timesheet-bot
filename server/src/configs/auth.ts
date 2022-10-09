export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET ?? 'DEFAULT',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
}
