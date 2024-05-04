export default {
    default: 'Whoops, looks like something went wrong.',
    notFound: 'The :attribute does not exist.',
    invalidScope: 'You are not allowed to :attribute.',
    account: {
        blocked: 'Your account has been blocked, please contact administrator',
        expired:
            'This account has been used before, please contact administrator.',
        invalidCode: ':attribute is invalid or expired.',
        emailExists: 'Email address already exists.',
        invalid: 'You have entered an invalid email! Please try again.',
        confirmPasswordNotMatch:
            'New password and confirm password must be exactly the same.',
    },
    user: {
        not_exists:
            'Your provided email address is not valid. Please contact the administrator.',
    },
    reset: {
        invalid:
            'Sorry, you have entered an invalid email. Please enter valid email to reset your password.',
        error: 'Whoops. Something went wrong!.',
        expired:
            'Please reset your password again because your link has expired.',
    },
    account_status: {
        blocked:
            'Your account has been blocked, please contact the administrator.',
        pending:
            'Your account is not activated yet, please check your email to activate it.',
        error: 'Whoops. Something went wrong!.',
        not_allowed: 'You are not allowed to update account status.',
    },
    credentials: {
        invalid:
            'You have entered an invalid email or password! Please try again.',
    },
    login: {
        loginRequirment: 'Must enter email or phone number.',
    },
    impacts: {
        noInterestAndGoals:
            'Client must have interests and goals to generate impacts.',
    },
    token_expired: 'Token expired.',
    file_token_exceeded:
        'This file ":filename" is exceeding token limit. Please upload a file that has words less than or equal to 1500.',
}
