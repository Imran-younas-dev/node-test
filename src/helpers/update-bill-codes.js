import { Op } from 'sequelize'
import { parseString } from 'xml2js'

import * as Sentry from '@sentry/node'

import checkSlackNotification from './check-slack-notification'
import { CodeModel, BillCodeModel, BillVersionModel } from '../models'

/**
 * initiate the sentry instance
 */
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
})

/**
 * @description: This function will fetch bill's latest version, will parse the xml, and then update the bill codes data.
 * @param {bills}
 */
export default async (bills) => {
    const billVersionIds = bills?.map((bill) => bill?.latest_bill_version_id)

    /* then find bill versions along with bill xml */
    const billVersions = await BillVersionModel.findAll({
        where: {
            bill_version_id: {
                [Op.in]: billVersionIds,
            },
        },
        attributes: ['bill_id', 'bill_version_id', 'bill_xml'],
        raw: true,
    })

    const billCodesData = []
    for (let index = 0; index < billVersions?.length; index++) {
        const version = billVersions[index]
        const billXML = version?.bill_xml
        let parsedData = {}

        /* parse bill XML */
        parseString(
            billXML,
            {
                explicitArray: false,
                normalizeTags: true,
            },
            async (err, result) => {
                if (err) {
                    await checkSlackNotification({
                        error: err,
                        recordTitle: 'update-bill-code-helper',
                        notification: `❌ Update bill codes job failed in parsing XML for bill id ${version?.bill_id}`,
                        notificationTitle: 'Update Bill Code Job Status',
                    })

                    // eslint-disable-next-line no-console
                    console.log(
                        `--------- Update bill codes job failed in parsing XML ----- ${err} ---- bill id ${version?.bill_id} ------------`
                    )
                    /* submit error to sentry */
                    Sentry.captureException(err)
                }
                parsedData = result
            }
        )

        const billSections =
            parsedData?.['caml:measuredoc']?.['caml:bill']?.[
                'caml:billsection'
            ] || []

        if (billSections?.length) {
            const codes = new Set([])
            for (let i = 0; i < billSections?.length; i++) {
                const section = billSections[i]

                if (section?.['caml:actionline']?.['caml:docname']) {
                    const codeName = section?.['caml:actionline']?.[
                        'caml:docname'
                    ]
                        .replace(/\s+/g, ' ')
                        .trim()
                    codes.add(codeName)
                }
            }
            const codesArray = [...codes]
            // eslint-disable-next-line no-console
            console.log(
                '---------- Bill codes ----------',
                codesArray,
                version?.bill_id
            )
            if (codesArray?.length) {
                const billCodes = await CodeModel.findAll({
                    where: {
                        [Op.or]: [...codes].map((str) => ({
                            title: { [Op.like]: `${str} - %` },
                        })),
                    },
                    attributes: ['code'],
                })

                // eslint-disable-next-line no-console
                console.log(
                    '--------- Bill codes fetched from DB -----------',
                    billCodes
                )

                billCodes.map((obj) => {
                    billCodesData.push({
                        code: obj?.code,
                        bill_id: version?.bill_id,
                        bill_version_id: version?.bill_version_id,
                    })
                })
            }
        }
    }
    if (billCodesData?.length) {
        /* update bill codes data */
        await BillCodeModel.createBulk(billCodesData, {
            updateOnDuplicate: ['bill_version_id', 'code'],
        })
    }
}
