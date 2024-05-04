// eslint-disable-next-line import/no-extraneous-dependencies
import PDFParser from 'pdf-parse'

const extractTextFromPDF = async (pdfBuffer) => {
    try {
        const pdfData = await PDFParser(pdfBuffer)
        const text = pdfData.text
        const wordCount = text.split(/\s+/).length
        return { status: 'succeed', wordCount }
    } catch (error) {
        return {
            status: 'failed',
        }
    }
}

export default extractTextFromPDF
