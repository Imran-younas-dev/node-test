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
        case 'fullName': {
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
                .isLength({ min, max })
                .withMessage(
                    translate('validations', 'charactersBetween', {
                        ':attribute': sentenceCase(field),
                        ':min': min.toString(),
                        ':max': max.toString(),
                    })
                )
        }

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
        case 'role_title':
        case 'status': {
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

        case 'permissions': {
            return check(field).custom(async (value, { req }) => {
                if (req?.body?.role_title === 'Associate' && !value?.length) {
                    throw new Error(
                        translate('validations', 'required', {
                            ':attribute': 'permissions',
                        })
                    )
                }
                return value
            })
        }

        case 'id':
        case 'role_id':
        case 'business_id': {
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
            rule.isInt({ min: 1 }).withMessage(
                translate('validations', 'integer', {
                    ':attribute': sentenceCase(field),
                })
            )
            return rule
        }

        case 'oldPassword': {
            const rule = check(field)
                .not()
                .isEmpty()
                .withMessage(
                    translate('validations', 'required', {
                        ':attribute': 'Old Password',
                    })
                )
            return rule
        }

        case 'newPassword': {
            const rule = check(field)
                .not()
                .isEmpty()
                .withMessage(
                    translate('validations', 'required', {
                        ':attribute': 'New password',
                    })
                )
                .matches(/^.*[0-9].*$/)
                .withMessage(
                    translate('validations', 'password.characters', {
                        ':attribute': 'New password',
                    })
                )
            return rule
        }

        case 'confirmPassword': {
            const rule = check(field)
                .not()
                .isEmpty()
                .withMessage(
                    translate('validations', 'required', {
                        ':attribute': 'Confirm password',
                    })
                )
                .matches(/^.*[0-9].*$/)
                .withMessage(
                    translate('validations', 'password.characters', {
                        ':attribute': sentenceCase(field),
                    })
                )
                .custom(async (value, { req }) => {
                    if (req?.body?.newPassword !== value) {
                        throw new Error(
                            translate(
                                'errors',
                                'account.confirmPasswordNotMatch'
                            )
                        )
                    }
                })
            return rule
        }
    }
}
