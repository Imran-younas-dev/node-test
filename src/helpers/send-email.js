import mailer from 'nodemailer'

import dayjs from '../helpers/dayjs'
import translate from '../helpers/translate'

async function sendMail(key, receiver, params) {
    params = {
        ...params,
        '{{YEAR}}': dayjs().year().toString(),
        '{{LOGO}}': process.env.APP_URL + 'logo.png',
        '{{SUPPORT_EMAIL}}': process.env.SUPPORT_EMAIL,
    }

    const subject = translate('templates', `${key}.subject`, params)
    const emailTemplate = translate('templates', `${key}.html`, params)

    if (
        process.env.SMTP_HOST &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS
    ) {
        const smtpConfig = {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: !!process.env.SMTP_SECURE,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        }

        const mailTransport = mailer.createTransport(smtpConfig)

        const mailOptions = {
            from: {
                name: process.env.EMAIL_SENDER_NAME,
                address: process.env.EMAIL_SENDER,
            },
            to: receiver,
        }

        mailOptions.html = emailTemplate
        mailOptions.subject = subject

        // send email
        return await mailTransport.sendMail(mailOptions)
    } else {
        // eslint-disable-next-line no-console
        console.log('Credentials not found', subject, emailTemplate)
    }
}

export default sendMail
