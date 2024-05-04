import { check } from 'express-validator'

import translate from '../helpers/translate'
import sentenceCase from '../helpers/sentence-case'

export const validate = (
    field,
    values,
    min = 2,
    max = 100,
    isRequired = true
) => {
    switch (field) {
        case 'email': {
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
            return rule.isEmail().withMessage(
                translate('validations', 'valid', {
                    ':attribute': sentenceCase(field),
                })
            )
        }
        case 'verificationCode': {
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
                rule.optional()
            }
            return rule
                .isString()
                .withMessage(
                    translate('validations', 'string', {
                        ':attribute': sentenceCase(field),
                    })
                )
                .isLength({ min, max })
                .withMessage(
                    translate('validations', 'validLength', {
                        ':attribute': sentenceCase(field),
                        ':length': max.toString(),
                    })
                )
        }
        case 'password': {
            const rule = check(field)
            if (isRequired) {
                rule.not()
                    .isEmpty()
                    .withMessage(
                        translate('validations', 'required', {
                            ':attribute': sentenceCase(field),
                        })
                    )
                    .isLength({ min, max })
                    .withMessage(
                        translate('validations', 'validLength', {
                            ':attribute': sentenceCase(field),
                            ':length': max.toString(),
                        })
                    )
            } else {
                rule.optional()
            }
            return rule.isString().withMessage(
                translate('validations', 'string', {
                    ':attribute': sentenceCase(field),
                })
            )
        }
    }
}
