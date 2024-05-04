import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'

import { TokenModel, RefreshTokenModel } from '../models'

export default async (user, scopes = [], remember = false) => {
    // number of seconds in a day
    const secondsInADay = 24 * 60 * 60

    // set token expiration based on remember me
    const tokenExpirationDate = remember
        ? dayjs().add(process.env.TOKEN_EXPIRATION_TIME_REMEMBER_ME, 'days')
        : dayjs().add(process.env.TOKEN_EXPIRATION_TIME, 'days')

    const refreshTokenExpirationDate = remember
        ? dayjs().add(process.env.TOKEN_EXPIRATION_TIME_REMEMBER_ME, 'days')
        : dayjs().add(process.env.TOKEN_EXPIRATION_TIME, 'days')

    // Store the access token to the database
    const accessTokenInstance = await TokenModel.create({
        body: {
            scopes: scopes,
            user_id: user.id,
            revoked: null,
            revoked_at: null,
            expires_at: tokenExpirationDate,
        },
    })

    // Store the refresh token to the database
    const refreshTokenInstance = await RefreshTokenModel.create({
        body: {
            access_token_id: accessTokenInstance.id,
            revoked: null,
            revoked_at: null,
            expires_at: refreshTokenExpirationDate,
        },
    })

    // generate jwt to access token
    const accessToken = jwt.sign(
        {
            id: accessTokenInstance.id,
            user_id: user.id,
            clientId: process.env.CLIENT_ID,
            scopes: scopes,
        },
        process.env.CLIENT_SECRET,
        {
            expiresIn: remember
                ? process.env.TOKEN_EXPIRATION_TIME_REMEMBER_ME * secondsInADay
                : process.env.TOKEN_EXPIRATION_TIME * secondsInADay,
        }
    )

    // generate jwt to refresh token
    const refreshToken = jwt.sign(
        {
            id: refreshTokenInstance.id,
            user_id: user.id,
            clientId: process.env.CLIENT_ID,
        },
        process.env.CLIENT_SECRET,
        {
            expiresIn: remember
                ? process.env.TOKEN_EXPIRATION_TIME_REMEMBER_ME * secondsInADay
                : process.env.TOKEN_EXPIRATION_TIME * secondsInADay,
        }
    )

    return {
        accessToken,
        refreshToken,
        tokenExpirationDate,
    }
}
