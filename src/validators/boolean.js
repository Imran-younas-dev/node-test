import { check } from 'express-validator'

/** helpers functions **/
import translate from '../helpers/translate'
import sentenceCase from '../helpers/sentence-case'

export const validateBoolean = (field) => {
    return check(field)
        .trim()
        .isBoolean()
        .withMessage(
            translate('validations', 'boolean', {
                ':attribute': sentenceCase(field),
            })
        )
}
