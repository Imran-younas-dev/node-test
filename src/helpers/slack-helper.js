import { isEmpty, isString } from 'lodash'

import { IncomingWebhook } from '@slack/webhook'

// Replace 'YOUR_SLACK_WEBHOOK_URL' with the actual URL from the Slack Incoming Webhooks app.
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL

const createCodeBlock = (code) => {
    if (isEmpty(code)) {
        return ''
    }
    code = isString(code) ? code.trim() : JSON.stringify(code, null, 2)

    const tripleBackticks = '```'

    return '_' + tripleBackticks + code + tripleBackticks + '\n'
}

async function sendSlackNotification({
    title,
    notification,
    codeBlock,
    allowChart,
    successPercent,
    errorPercent,
}) {
    try {
        const slack = new IncomingWebhook(slackWebhookUrl)
        const attachment = {
            fallback: title,
            title: title,
            text: codeBlock
                ? notification + createCodeBlock(codeBlock)
                : notification,

            footer: process.env.APP_NAME,
            ts: parseInt(Date.now() / 1000),
        }
        const chart = {
            type: 'pie',
            data: {
                labels: [],
                datasets: [
                    {
                        data: [],
                    },
                ],
            },
        }
        if (successPercent) {
            chart.data.labels.push('Success')
            chart.data.datasets[0]?.data.push(`${successPercent}%`)
        }
        if (errorPercent) {
            chart.data.labels.push('Error')
            chart.data.datasets[0]?.data.push(`${errorPercent}%`)
        }

        const encodedChart = encodeURIComponent(JSON.stringify(chart))
        const chartUrl = `https://quickchart.io/chart?c=${encodedChart}`
        if (allowChart) {
            attachment.image_url = chartUrl
        }

        await slack.send({
            username: process.env.APP_NAME,
            channel: process.env.SLACK_CHANNEL,
            icon_emoji: ':bell:',
            attachments: [attachment],
        })

        // eslint-disable-next-line
        console.log('Slack notification sent')
    } catch (error) {
        // eslint-disable-next-line
        console.error('Error sending Slack notification:', error.message)
    }
}

export default sendSlackNotification
