import jwt from 'jsonwebtoken'

import { RefreshTokenModel, RoleModel, UserModel } from '../../models'

import generateToken from '../../helpers/generate-token'
import translate from '../../helpers/translate'

export const refresh = async (request, response) => {
    const token = request.headers.authorization?.split(' ').pop()
    if (!token) {
        return response.status(404).send({
            message: translate('validations', 'required', {
                ':attribute': 'Refresh token',
            }),
        })
    }
    const payload = await jwt.verify(token, process.env.CLIENT_SECRET)

    if (payload) {
        const refreshToken = await RefreshTokenModel.findByPk(payload.id, {
            raw: true,
        })

        if (refreshToken && !refreshToken.revoked_at) {
            const user = await UserModel.findByPk(payload.userId, {
                attributes: ['role_id', 'id'],
            })

            if (user) {
                const role = await RoleModel.findByPk(user.role_id, {
                    attributes: ['id'],
                })
                if (role) {
                    const token = await generateToken(user, role.scopes)

                    if (token) {
                        return response.json({
                            token,
                        })
                    }
                }
            }
        }
    }
    return response.status(401).send({
        message: translate('errors', 'token_expired'),
    })
}
