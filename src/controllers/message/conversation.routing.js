import { get } from './get.action'
import { create } from './create.action'
import { remove } from './remove.action'

import { validate } from '../../validators/message'
import { validateEnum } from '../../validators/enum'

import { asyncHandler } from '../../middlewares/exception-handler'
import authenticate from '../../middlewares/authenticate'
import validationResponse from '../../middlewares/validation-response'

module.exports = {
    '/': {
        get: {
            middlewares: [
                authenticate,
                validate({
                    field: 'conversationId',
                }),
                validationResponse,
            ],
            action: asyncHandler(get),
        },
        post: {
            middlewares: [
                authenticate,
                validate({
                    field: 'conversationId',
                }),
                validate({
                    field: 'content',
                }),
                validationResponse,
            ],
            action: asyncHandler(create),
        },
    },
    '/:id': {
        delete: {
            middlewares: [
                authenticate,
                validateEnum('deleteWith', ['me', 'everyone'], true),
                validationResponse,
            ],
            action: asyncHandler(remove),
        },
    },
}
