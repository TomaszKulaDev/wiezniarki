export const jwtConfig = {
  accessToken: {
    secret:
      process.env.JWT_ACCESS_TOKEN_SECRET ||
      "fallback_access_secret_development_only",
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m", // 15 minut
  },
  refreshToken: {
    secret:
      process.env.JWT_REFRESH_TOKEN_SECRET ||
      "fallback_refresh_secret_development_only",
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d", // 7 dni
  },
  issuer: process.env.JWT_ISSUER || "wiezniarki.app",
  audience: process.env.JWT_AUDIENCE || "wiezniarki.app",
};
