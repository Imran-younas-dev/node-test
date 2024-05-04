import { map, startCase, chain } from 'lodash'

import translate from '../helpers/translate'
import { formatMessage } from '../helpers/format-error-message'

export default (error, request, response, next) => {
    if (Buffer.isBuffer(error)) {
        error = error.toString()
    }
    if (process.env.DEBUG_MODE !== false) {
        // eslint-disable-next-line no-console
        console.error('error', error)
    }
    switch (error.name) {
        case 'SequelizeDatabaseError':
            response.status(422).json({
                message: translate('errors', 'default'),
            })

            break

        case 'SequelizeValidationError':
            response.status(422).json({
                message: translate('validations', 'default'),
                // eslint-disable-next-line
                errors: chain(error.errors)
                    .keyBy('path')
                    .mapValues('message')
                    .value(),
            })

            break

        case 'AppValidationError':
            response.status(error.code).json({
                message: error.message,
            })

            break

        case 'SequelizeUniqueConstraintError': {
            let message
            if (error?.errors?.length) {
                const columnName = error?.errors[0]?.path?.split('.').pop()
                message = translate('validations', 'alreadyExists', {
                    ':attribute': startCase(columnName),
                })

                message = message ?? error?.errors[0]?.message
            }
            response.status(409).json({
                message,
            })

            break
        }
        case 'AggregateError': {
            response.status(422).json({
                message: translate('validations', 'default'),
                errors: formatMessage(map(error.errors, 'message')),
            })

            break
        }
        case 'SequelizeForeignKeyConstraintError': {
            let message
            const columnName = error.fields[0]
            message = translate('validations', 'valid', {
                ':attribute': startCase(columnName),
            })
            message = message ? message : error.message

            response.status(409).json({
                message: message,
            })

            break
        }
        case 'AppValidationErrorWithData': {
            response.status(error.code).json({
                message: error.message,
                data: error.data,
            })

            break
        }
        default:
            response.status(500).json({
                message: translate('errors', 'default'),
            })
    }
}

export const asyncHandler = (callback) => {
    return function (request, response, next) {
        return callback(request, response, next).catch(next)
    }
}
