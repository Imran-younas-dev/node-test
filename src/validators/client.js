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
        case 'bill_tracking_id':
        case 'industry_id':
        case 'businessId':
        case 'associateId':
        case 'client_id':
        case 'trackingBillIds.*':
        case 'scorecardId': {
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
            return rule.isInt({ min: 1 }).withMessage(
                translate('validations', 'valid', {
                    ':attribute': sentenceCase(field),
                })
            )
        }
        case 'stance':
        case 'status': {
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
            return rule
                .isString()
                .withMessage(
                    translate('validations', 'string', {
                        ':attribute': sentenceCase(field),
                    })
                )
                .isIn(values)
                .withMessage(
                    translate('validations', 'invalidEnum', {
                        ':attribute': sentenceCase(field),
                        ':values': `${values?.join(', ')}`,
                    })
                )
        }
        case 'keyword': {
            return check(field)
                .optional({ checkFalsy: true })
                .isString()
                .withMessage(
                    translate('validations', 'string', {
                        ':attribute': sentenceCase(field),
                    })
                )
        }

        case 'trackingBillIds':
        case 'tracking_bills':
        case 'reasons':
        case 'interests_goals':
        case 'tracking_keywords': {
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
            return rule.isArray({ min }).withMessage(
                translate('validations', 'valid', {
                    ':attribute': sentenceCase(field),
                })
            )
        }
        case 'cp_name':
        case 'bill_id':
        case 'short_bio':
        case 'billId':
        case 'cp_address':
        case 'client_name':
        case 'industryTitle':
        case 'billVersionId':
        case 'reasons.*':
        case 'interests_goals.*':
        case 'tracking_keywords.*':
        case 'tracking_bills.*':
        case 'value': {
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
            if (min && max) {
                rule.isLength({ min, max }).withMessage(
                    translate('validations', 'length', {
                        ':attribute': sentenceCase(field),
                        ':min': min.toString(),
                        ':max': max.toString(),
                    })
                )
            }
            return rule
        }
        case 'cp_phone': {
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
            return rule
                .isString()
                .withMessage(
                    translate('validations', 'string', {
                        ':attribute': sentenceCase(field),
                    })
                )
                .matches(/^\+?[0-9\s()-]{7,20}$/)
                .withMessage(translate('validations', 'validPhoneNumber'))
        }
        case 'cp_email': {
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
            return rule
                .isString()
                .withMessage(
                    translate('validations', 'string', {
                        ':attribute': sentenceCase(field),
                    })
                )
                .isLength({ min })
                .withMessage(
                    translate('validations', 'minimum', {
                        ':attribute': sentenceCase(field),
                        ':min': min?.toString(),
                    })
                )
                .isEmail()
                .withMessage(
                    translate('validations', 'valid', {
                        ':attribute': sentenceCase(field),
                    })
                )
        }
    }
}
