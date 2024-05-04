import AppValidationError from '../exceptions/AppValidationError'

import translate from './translate'
import generateAssistantId from './generate-assistant-id'

import { BillVersionModel, ConversationModel } from '../models'

export default async (params) => {
    const { id, billVersionId, userId, businessId } = params

    const bill = await BillVersionModel.findOne({
        where: {
            bill_id: id,
            bill_version_id: billVersionId,
        },
        attributes: [
            'bill_id',
            'bill_version_id',
            'assistant_id',
            'version_num',
        ],
    })

    if (!bill) {
        throw new AppValidationError(
            translate('validations', 'notFound', {
                ':attribute': 'Bill',
            }),
            404
        )
    }

    /* in case bill version assistant_id is not present */
    if (!bill?.assistant_id) {
        bill.assistant_id = await generateAssistantId(bill)
        await bill.save()
    }

    const conversation = await ConversationModel.create({
        body: {
            bill_id: id,
            business_id: businessId,
            user_id: userId,
            bill_version_id: billVersionId,
            assistant_id: bill?.assistant_id,
        },
    })

    return conversation
}
