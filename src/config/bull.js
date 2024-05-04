import dotenv from 'dotenv'

/**
 * load environment variables from .env
 */
dotenv.config()

export default {
    prefix: process.env.QUEUE_PREFIX,
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    },
}
