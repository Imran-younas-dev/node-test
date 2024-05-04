/* eslint-disable indent */
import fs from 'fs'
import path from 'path'
import dayjs from './dayjs'

import AppValidationError from '../exceptions/AppValidationError'
// eslint-disable-next-line import/no-extraneous-dependencies
import csvToJson from 'csvtojson'

import { CalendarModel } from '../models'

/**
 * @description  a function that will upload calendar data
 *
 *
 */
export default async () => {
    const calendarFilePath = path.join(
        __dirname,
        '../../',
        'seeders',
        'data',
        'calendar.csv'
    )

    if (!fs.existsSync(calendarFilePath)) {
        throw new AppValidationError('Calendar file does not exist.')
    }

    const jsonBody = await csvToJson({ delimiter: '\t' }).fromFile(
        calendarFilePath
    )

    const body = []
    for (const item of jsonBody) {
        body.push({
            title: item?.Title,
            start_date: item['Given planned earliest start']
                ? dayjs(item['Given planned earliest start']).format(
                      'YYYY-MM-DD'
                  )
                : null,
            end_date: item['Given planned earliest end']
                ? dayjs(item['Given planned earliest end']).format('YYYY-MM-DD')
                : null,
        })
    }

    await CalendarModel.createBulk(body)

    const updateFilePath = path.join(
        __dirname,
        '../../',
        'seeders',
        'data',
        `calendar-${dayjs()}.csv`
    )
    fs.rename(calendarFilePath, updateFilePath, (err) => {
        if (err) {
            // eslint-disable-next-line no-console
            console.error('Error renaming file:', err)
        } else {
            // eslint-disable-next-line no-console
            console.log('File renamed successfully.')
        }
    })
}
