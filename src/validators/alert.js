import { check } from 'express-validator'

import translate from '../helpers/translate'
import sentenceCase from '../helpers/sentence-case'

export const validate = ({ field, min = 1, max = 100, isRequired = true }) => {
    switch (field) {
        case 'id': {
            const rule = check(field)
            if (!isRequired) {
                rule.optional({ checkFalsy: true })
            } else {
                rule.notEmpty().withMessage(
                    translate('validations', 'required', {
                        ':attribute': sentenceCase(field),
                    })
                )
            }
            rule.isInt({ min: 1 }).withMessage(
                translate('validations', 'valid', {
                    ':attribute': sentenceCase(field),
                })
            )
            return rule
        }
        case 'status':
        case 'client_ids': {
            const rule = check(field)
            if (isRequired) {
                rule.not()
                    .isEmpty()
                    .withMessage(
                        translate('validations', 'required', {
                            ':attribute': sentenceCase(field),
                        })
                    )
            } else {
                rule.optional({ checkFalsy: true })
            }

            rule.isString().withMessage(
                translate('validations', 'string', {
                    ':attribute': sentenceCase(field),
                })
            )
            if (max || min) {
                rule.isLength(max ? { max, min } : { min }).withMessage(
                    translate('validations', 'charactersBetween', {
                        ':attribute': sentenceCase(field),
                        ':max': max?.toString(),
                        ':min': min?.toString(),
                    })
                )
            }
            return rule
        }
    }
}
