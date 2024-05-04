import { login } from './login.action'
import { logout } from './logout.action'
import { verifyCode } from './verify-code.action'

/** helpers functions **/
import { validate } from '../../validators/auth'

/* middlewares */
import authenticate from '../../middlewares/authenticate'
import validationResponse from '../../middlewares/validation-response'
import { asyncHandler } from '../../middlewares/exception-handler'

module.exports = {
    '/login': {
        post: {
            middlewares: [
                /* Apply middlewares*/
                validate('email'),
                validate('password', null, 10, 30),
                validationResponse,
            ],
            action: asyncHandler(login),
        },
    },
    '/logout': {
        post: {
            middlewares: [authenticate],
            action: asyncHandler(logout),
        },
    },
    '/verify-code': {
        post: {
            middlewares: [
                /* Apply middlewares*/
                validate('email', null, 2, 100),
                validate('verificationCode', null, 6, 6),
                validationResponse,
            ],
            action: asyncHandler(verifyCode),
        },
    },
}
