import { check } from 'express-validator'
/** helpers functions **/
import translate from '../helpers/translate'
import sentenceCase from '../helpers/sentence-case'

export const validateEnum = (field, values, isRequired = true) => {
    return check(field)
        .trim()
        .optional({ checkFalsy: !isRequired }) // Use !isRequired to invert the value
        .isIn(values)
        .withMessage(
            translate('validations', 'validOptions', {
                ':attribute': sentenceCase(field),
                ':options': values.join(', '),
            })
        )
}
