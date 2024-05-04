import path from 'path'
import { replace } from 'lodash'
import fs from 'fs/promises'

export default async ({ data, html }) => {
    const mergeCodes = {
        '{{LOGO}}': 'file_url',
        '{{EMAIL}}': 'email',
        '{{COMPANY_NAME}}': 'business_title',
        '{{CONTACT_NUMBER}}': 'contact_number',
    }
    const keys = Object.keys(mergeCodes)
    let updatedHtml = html
    let allowLogo = false
    let base64Image
    for (const mergeCode of keys) {
        const val = data[mergeCodes[mergeCode]]
        if (html?.includes(mergeCode) && val) {
            if (mergeCode == '{{LOGO}}') {
                allowLogo = true
                updatedHtml = replace(updatedHtml, mergeCode, '')

                const filePath = path.join(__dirname, '..', '..', val)

                const img = await fs.readFile(filePath)
                base64Image = `data:image/png;base64,${Buffer.from(
                    img,
                    'binary'
                ).toString('base64')}`
            }
            updatedHtml = updatedHtml?.replaceAll(mergeCode, val)
        }
    }

    return { updatedHtml, allowLogo, base64Image }
}
