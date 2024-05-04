import { UserModel, RoleModel } from '../../models'

import AppValidationError from '../../exceptions/AppValidationError'

import dayjs from '../../helpers/dayjs'
import translate from '../../helpers/translate'
import generateToken from '../../helpers/generate-token'

/* Verify  Account
 * @description This method will verify user's account
 * @input verification code
 * @return (Object)
 */
export const verifyCode = async (request, response) => {
    const {
        body: { verificationCode, email, remember },
    } = request

    /* check if user is in pending status */
    const user = await UserModel.findOne({
        where: {
            verification_code: verificationCode,
            email,
        },
        raw: true,
        attributes: ['id', 'role_id', 'role_title', 'status'],
    })

    /* throw error if user does not exist or verification code does not match */
    if (!user) {
        throw new AppValidationError(
            translate('errors', 'account.invalidCode', {
                ':attribute': 'Verification code',
            })
        )
    }

    if (verificationCode) {
        const currentDate = dayjs()
        const verifcationDate = dayjs(user?.verifiedAt)

        /* Taking difference of date in terms of minutes */
        const minutes = currentDate.diff(verifcationDate, 'minutes')

        if (minutes > process.env.VERIFICATION_CODE_EXPIRATION_TIME) {
            throw new AppValidationError(
                translate('errors', 'account.invalidCode', {
                    ':attribute': 'Verification code',
                })
            )
        }
    }

    /* check if user is in blocked status */
    if (user?.status === 'blocked') {
        throw new AppValidationError(translate('errors', 'account.blocked'))
    }

    await UserModel.update({
        params: {
            id: user.id,
        },
        body: {
            verification_code: null,
            verified_at: null,
        },
    })

    const role = await RoleModel.findOne({
        where: {
            title: user?.role_title,
        },
        attributes: ['id', 'scopes'],
        raw: true,
    })

    /* generate tokens */
    const data = await generateToken(user, role?.scopes, remember)

    return response.json({
        data: {
            accessToken: data?.accessToken,
            refreshToken: data?.refreshToken,
            expiresIn: data?.tokenExpirationDate,
        },
    })
}
