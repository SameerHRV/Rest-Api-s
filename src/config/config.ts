import { config as conf } from 'dotenv'

conf();

const _config = {
  port: process.env.PORT || 5000,
  dbUri: process.env.MONGODB_URI
}


export const config = Object.freeze(_config)
