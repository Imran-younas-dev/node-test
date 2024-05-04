import { check } from 'express-validator'
import sentenceCase from '../helpers/sentence-case'

import translate from '../helpers/translate'

export const validateArray = (field) => {
    return check(field)
        .isArray()
        .withMessage(
            translate('validations', 'array', {
                ':attribute': sentenceCase(field),
            })
        )
}
