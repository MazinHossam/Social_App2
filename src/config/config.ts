import  { resolve } from 'node:path';
import { config } from "dotenv";
config({path:resolve(`./.env.${process.env.NODE_ENV}`)})
export const PORT=process.env.PORT
export const DB_URI=process.env.DB_URI as string
export const REDIS_URI=process.env.REDIS_URI as string
export const SALT_ROUND=parseInt(process.env.SALT_ROUND ?? '10')
export const EMAIL_APP=process.env.EMAIL_APP
export const APP_EMAIL_PASSWORD=process.env.APP_EMAIL_PASSWORD
export const TOKEN_KEY_USER=process.env.TOKEN_KEY_USER
export const TOKEN_KEY_ADMIN=process.env.TOKEN_KEY_ADMIN
export const TOKEN_KEY_USER_REFRESH=process.env.TOKEN_KEY_USER_REFRESH
export const TOKEN_KEY_ADMIN_REFRESH=process.env.TOKEN_KEY_ADMIN_REFRESH