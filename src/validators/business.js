import { check } from 'express-validator'

import startCase from 'lodash/startCase'
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
        case 'status': {
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
                        ':values': `${values}`,
                    })
                )

            return rule
        }
        case 'logo':
        case 'contact_info': {
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

        case 'title':
        case 'header':
        case 'footer':
        case 'description':
        case 'logo.file_url':
        case 'logo.file_name':
        case 'logo.original_name':
        case 'contact_info.address':
        case 'contact_info.name': {
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
        case 'contact_info.email': {
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
        case 'contact_info.number': {
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
                .matches(/^\+?[0-9\s()-]{7,20}$/)
                .withMessage(translate('validations', 'validPhoneNumber'))
        }
        case 'footer_required':
        case 'header_required': {
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
            rule.isBoolean().withMessage(
                translate('validations', 'invalid', {
                    ':attribute': sentenceCase(field),
                })
            )
            rule.custom((value, { req }) => {
                if (field === 'header_required' && value && !req.body.header) {
                    throw new Error(
                        translate('validations', 'required', {
                            ':attribute': startCase('header'),
                        })
                    )
                }
                if (field === 'footer_required' && value && !req.body.footer) {
                    throw new Error(
                        translate('validations', 'required', {
                            ':attribute': startCase('footer'),
                        })
                    )
                }
                return true
            })

            return rule
        }
    }
}
