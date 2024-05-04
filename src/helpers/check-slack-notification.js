import dayjs from './dayjs'
import { Op } from 'sequelize'
import sendSlackNotification from './slack-helper'

import sequelize, { NotificationLockModel } from '../models'

export default async ({
    error,
    recordTitle,
    notification,
    notificationTitle,
}) => {
    const now = dayjs()
    const notificationExist = await NotificationLockModel.findOne({
        where: {
            [Op.and]: [
                sequelize.where(
                    sequelize.fn('DATE', sequelize.col('created_at')),
                    {
                        [Op['eq']]: dayjs(now).format('YYYY-MM-DD'),
                    }
                ),
                { title: recordTitle },
            ],
        },
    })
    if (!notificationExist) {
        await sendSlackNotification({
            title: notificationTitle,
            notification,
            codeBlock: error,
        })
        await NotificationLockModel.create({
            body: { title: recordTitle },
        })
    }
}
