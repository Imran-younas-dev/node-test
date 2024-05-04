// import dayjs from 'dayjs'
// import * as Sentry from '@sentry/node'

// import {
//     BusinessModel,
//     // UserModel,
//     AlertModel,
// } from '../models'
// import checkSlackNotification from './check-slack-notification'

// /**
//  * initiate the sentry instance
//  */
// Sentry.init({
//     dsn: process.env.SENTRY_DSN,
//     environment: process.env.NODE_ENV,
//     tracesSampleRate: 0.1,
// })

// /**
//  * @description: This function will filter bill history data into alerts w.r.t clients of a businesses.
//  * @param {bills}
//  */
// export default async (billHistory, billHistoryIndex) => {
//     try {
//         // eslint-disable-next-line
//         console.log(
//             `------  Process Bill History into Alert Helper is in progress ------`
//         )

//         /* process bills */
//         const limit = 15
//         let offset = 0

//         let businessData = []
//         do {
//             const alerts = []
//             businessData = await BusinessModel.findAll({
//                 where: {
//                     status: 'active',
//                 },
//                 attributes: ['id'],
//                 offset,
//                 limit,
//             })

//             for (const business of businessData) {
//                 const alert = {
//                     user_id: null,
//                     business_id: business?.id,
//                     details: billHistory?.action,
//                     bill_id: billHistory?.bill_id,
//                     bill_history_id: billHistory?.bill_history_id,
//                     bill_status: billHistory?.bills?.current_status,
//                     bill_subject: billHistory?.bills?.version?.subject,
//                     action_date: billHistory?.action_date
//                         ? dayjs(billHistory?.action_date)
//                         : null,
//                     clients: [],
//                 }
//                 const clientTracking = billHistory?.bills?.client_bill_trackings
//                 if (clientTracking?.length) {
//                     for (const item of clientTracking) {
//                         if (item?.bill_clients?.business_id == business?.id) {
//                             alert.clients.push({
//                                 id: item?.bill_clients?.id,
//                                 client_name: item?.bill_clients?.client_name,
//                             })
//                         }
//                     }
//                 }
//                 alerts.push(alert)
//             }

//             await AlertModel.createBulk(alerts)
//             offset += limit
//         } while (businessData?.length)

//         // const groupedData = billHistory?.bills?.client_bill_trackings?.reduce(
//         //     (acc, item) => {
//         //         if (!acc[businessId]) {
//         //             acc[businessId] = {
//         //                 user_id: userId,
//         //                 business_id: businessId,
//         //                 details: billHistory?.action,
//         //                 bill_id: billHistory?.bill_id,
//         //                 bill_history_id: billHistory?.bill_history_id,
//         //                 bill_status: billHistory?.bills?.current_status,
//         //                 bill_subject: billHistory?.bills?.version?.subject,
//         //                 action_date: billHistory?.action_date
//         //                     ? dayjs(billHistory?.action_date)
//         //                     : null,
//         //                 clients: [],
//         //             }
//         //         }

//         //         acc[businessId].clients.push({
//         // id: item?.bill_clients?.id,
//         // client_name: item?.bill_clients?.client_name,
//         //         })

//         //         return acc
//         //     },
//         //     {}
//         // )

//         // Convert the grouped data into an array
//         // const alert = Object.values(groupedData)

//         /* if bill is not tracked but any client*/

//         /* if a bill not tracked by any of the client a that is bill
//         is followed by a business then generate its alert*/
//         // eslint-disable-next-line
//         // console.log(alert)
//         // if (!alert?.length && billHistory?.bills?.user_bill_trackings?.length) {
//         //     const userBillTrack = billHistory?.bills?.user_bill_trackings
//         //     for (const item of userBillTrack) {
//         //         alert.push({
//         //             user_id: item?.user_id,
//         //             business_id: item?.business_id,
//         //             details: billHistory?.action,
//         //             bill_id: billHistory?.bill_id,
//         //             bill_history_id: billHistory?.bill_history_id,
//         //             bill_status: billHistory?.bills?.current_status,
//         //             bill_subject: billHistory?.bills?.version?.subject,
//         //             action_date: billHistory?.action_date
//         //                 ? dayjs(billHistory?.action_date)
//         //                 : null,
//         //             clients: [],
//         //         })
//         //     }
//         // }
//         // eslint-disable-next-line
//         console.log(
//             `------  Process Bill History into Alert Helper is completed ------`
//         )
//         return true
//     } catch (error) {
//         // eslint-disable-next-line no-console
//         console.log(
//             `--------- Process Bill History into Alert Helper is aborted -----${error}`
//         )
//         const notification = `❌ Process Bill History into Alert Helper is aborted at ${dayjs()}`

//         await checkSlackNotification({
//             error,
//             recordTitle: 'alert-process-helper',
//             notification,
//             notificationTitle: 'Process Bill History into Alert Helper Status',
//         })

//         /* submit error to sentry */
//         Sentry.captureException(error)
//         /* hit callback with error */
//         return false
//     }
// }
