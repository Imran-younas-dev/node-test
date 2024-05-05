import bcrypt from 'bcrypt'

import dayjs from '../../helpers/dayjs'
import translate from '../../helpers/translate'
import sendEmail from '../../helpers/send-email'

import AppValidationError from '../../exceptions/AppValidationError'

import { UserModel } from '../../models'

/* Send Verification Code
 * @description This method will send verification code to user
 * @input user email
 * @return (Object)
 */
export const login = async (request, response) => {
    const {
        body: { email, password },
    } = request

    const where = {
        email,
    }

    const user = await UserModel.findOne({
        where,
        attributes: ['id', 'status', 'password', 'email'],
        raw: true,
    })

    if (user && user?.status === 'blocked') {
        throw new AppValidationError(
            translate('errors', 'account.blocked'),
            403
        )
    }

    if (user && user?.status === 'pending') {
        throw new AppValidationError(
            translate('errors', 'account.activate'),
            403
        )
    }

    if (
        user?.password &&
        !bcrypt.compareSync(password.toString(), user?.password)
    ) {
        throw new AppValidationError(
            translate('errors', 'credentials.invalid'),
            404
        )
    }

    const verificationCode = Math.floor(
        100000 + Math.random() * 900000
    ).toString()

    await UserModel.updateByPk(user?.id, {
        body: {
            verification_code: verificationCode,
            verifiedAt: dayjs(),
        },
    })

    await sendEmail('account-verification', user.email, {
        '{{CODE}}': verificationCode,
        '{{FULLNAME}}': user?.fullName,
    })

    /* send response */
    return response.send({
        message: translate('messages', 'sendVerificationCode.success'),
    })
}
