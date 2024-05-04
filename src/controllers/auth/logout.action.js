/* eslint-disable camelcase */
/* eslint-disable babel/camelcase */
import { TokenModel, RefreshTokenModel } from '../../models'

import dayjs from 'dayjs'

import translate from '../../helpers/translate'

export const logout = async (request, response) => {
    const { id, user_id } = request.authInfo
    /* revoke access token */
    const token = await TokenModel.update({
        params: {
            id,
            user_id,
        },
        body: {
            revoked_at: dayjs().format(),
            updated_at: dayjs().format(),
        },
    })

    /* if token does not exist return error */
    if (!token) {
        return response.status(422).json({
            message: translate('errors', 'logout.invalid'),
        })
    }

    /* revoke refresh token */
    await RefreshTokenModel.update({
        params: {
            id,
            access_token_id: id,
        },
        body: {
            revoked_at: dayjs().format(),
            updated_at: dayjs().format(),
        },
    })

    const message = translate('messages', 'logout.successful')

    /* send response */
    return response.json({ message })
}
