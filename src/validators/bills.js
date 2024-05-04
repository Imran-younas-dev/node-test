import { check } from 'express-validator'

import translate from '../helpers/translate'

import sentenceCase from '../helpers/sentence-case'

export const validate = ({
    field,
    min = 1,
    max = 200,
    isRequired = true,
    values = [],
}) => {
    switch (field) {
        case 'user_bill_tracking_id': {
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
        case 'id':
        case 'billVersionIds':
        case 'bill_version_id':
        case 'billId':
        case 'keyword':
        case 'session':
        case 'vote_date_time':
        case 'location_code':
        case 'motion_id':
        case 'chamber':
        case 'status':
        case 'measure_type':
        case 'code':
        case 'vote_date_seq':
        case 'reason':
        case 'message': {
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

        case 'conversation_id':
        case 'messageId': {
            return check(field)
                .optional({ checkFalsy: true })
                .isInt({ min: 1 })
                .withMessage(
                    translate('validations', 'valid', {
                        ':attribute': sentenceCase(field),
                    })
                )
        }
        case 'action': {
            const rule = check(field)
            if (!isRequired) {
                rule.optional({ checkFalsy: true })
            } else {
                rule.not()
                    .isEmpty()
                    .withMessage(
                        translate('validations', 'required', {
                            ':attribute': sentenceCase(field),
                        })
                    )
            }
            rule.isString()
                .withMessage(
                    translate('validations', 'string', {
                        ':attribute': sentenceCase(field),
                    })
                )
                .isIn(values)
                .withMessage(
                    translate('validations', 'invalidEnum', {
                        ':attribute': sentenceCase(field),
                        ':values': values.join(', '),
                    })
                )
            return rule
        }
        case 'feedback': {
            return check(field)
                .optional({ checkFalsy: true })
                .isBoolean()
                .withMessage(
                    translate('validations', 'boolean', {
                        ':attribute': sentenceCase(field),
                    })
                )
        }
    }
}
