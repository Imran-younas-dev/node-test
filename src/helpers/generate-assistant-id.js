import path from 'path'
import { existsSync } from 'fs'

import exec from './exec'
import generatePdfFileName from './generate-pdf-file-name'

/**
 * @description: This function will generate assistant_id for bill version
 * @param {data}
 */
export default async (data) => {
    const fileName = generatePdfFileName(data)

    const filePath = path.join(
        __dirname,
        '..',
        '..',
        'storage',
        'bill-pdfs',
        fileName
    )

    // eslint-disable-next-line no-console
    console.log(fileName, 'fileName', existsSync(filePath), filePath)
    // if (existsSync(filePath)) {
    const assistant = await exec(
        ['--input', `{ "file_path": "${filePath}" }`],
        'scripts/loading.py'
    )

    return JSON.parse(assistant)?.file_id
}
