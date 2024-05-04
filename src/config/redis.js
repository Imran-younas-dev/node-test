const redis = require('redis')

let client = null

export const createClient = async () => {
    if (!client) {
        client = redis.createClient({
            port: process.env.REDIS_PORT || '6379',
            host: process.env.REDIS_HOST || 'localhost',
            password: process.env.REDIS_PASSWORD || undefined,
        })
    }
    return client
}

/* get data from cache */
export const getDataFromRedis = async (key) => {
    key = process.env.CACHE_PREFIX + key
    return new Promise(function (resolve, reject) {
        client.get(key, async function (error, data) {
            if (error) {
                reject(error)
            } else {
                resolve(JSON.parse(data))
            }
        })
    })
}

/* set data in cache */
export const setDataToRedis = async (key, data) => {
    key = process.env.CACHE_PREFIX + key
    return new Promise(function (resolve, reject) {
        client.set(key, JSON.stringify(data), async function (error, data) {
            if (error) {
                reject(error)
            } else {
                resolve(data)
            }
        })
    })
}

/* delete data from cache */
export const deleteDataFromRedis = async (key) => {
    key = process.env.CACHE_PREFIX + key
    return new Promise(function (resolve, reject) {
        client.del(key, async function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}
