import _ from 'lodash'
import { validationResult } from 'express-validator'

export default (request, response, next) => {
    const errors = validationResult(request)

    if (!errors.isEmpty()) {
        return response.status(422).json({
            message: 'Please fix following errors',
            errors: _.chain(
                errors.array({
                    onlyFirstError: true,
                })
            )
                .keyBy('path')
                .mapValues('msg')
                .value(),
        })
    }
    return next()
}
