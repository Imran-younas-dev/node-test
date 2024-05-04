import { create } from './create.action'
import { get } from './get.action'

import { validate } from '../../validators/conversation'

import { asyncHandler } from '../../middlewares/exception-handler'
import authenticate from '../../middlewares/authenticate'
import validationResponse from '../../middlewares/validation-response'

module.exports = {
    '/': {
        get: {
            middlewares: [authenticate, validationResponse],
            action: asyncHandler(get),
        },
        post: {
            middlewares: [
                authenticate,
                validate({
                    field: 'userId',
                }),
                validationResponse,
            ],
            action: asyncHandler(create),
        },
    },
}
