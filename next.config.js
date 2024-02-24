const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  compress: false,
  i18n,
  env: {
    PRODUCTION: process.env.PRODUCTION,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_GOFACT_API_TOKEN: process.env.NEXT_PUBLIC_GOFACT_API_TOKEN,
    infura_key: process.env.infura_key,
  },
}
