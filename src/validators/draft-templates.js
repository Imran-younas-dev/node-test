import { check } from 'express-validator'

import translate from '../helpers/translate'
import sentenceCase from '../helpers/sentence-case'

export const validate = ({
    field,
    values,
    min = 2,
    max = 100,
    isRequired = true,
}) => {
    switch (field) {
        case 'id':
        case 'business_id': {
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
        case 'stance':
        case 'file.original_name':
        case 'file.file_name':
        case 'file.file_url': {
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
            rule.isString().withMessage(
                translate('validations', 'string', {
                    ':attribute': sentenceCase(field),
                })
            )
            if (min && max) {
                rule.isLength({ min, max }).withMessage(
                    translate('validations', 'length', {
                        ':attribute': sentenceCase(field),
                        ':min': min.toString(),
                        ':max': max.toString(),
                    })
                )
            }
            if (min) {
                rule.isLength({ min }).withMessage(
                    translate('validations', 'minimum', {
                        ':attribute': sentenceCase(field),
                        ':min': min.toString(),
                    })
                )
            }
            if (values?.length) {
                rule.isIn(values).withMessage(
                    translate('validations', 'validOptions', {
                        ':attribute': sentenceCase(field),
                        ':options': values.join(', '),
                    })
                )
            }
            return rule
        }
        case 'file': {
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
            rule.isObject().withMessage(
                translate('validations', 'valid', {
                    ':attribute': sentenceCase(field),
                })
            )
            return rule
        }
    }
}
