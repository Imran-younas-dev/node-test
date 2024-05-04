import translate from '../../helpers/translate'
import AppValidationError from '../../exceptions/AppValidationError'
import {
    ConversationModel,
    MessageModel,
    MessageVisibilityModel,
} from '../../models'

export const create = async (request, response) => {
    const { body, user } = request

    const conversation = await ConversationModel.findOne({
        where: {
            id: body.conversationId,
        },
    })

    if (!conversation) {
        throw new AppValidationError(
            translate('errors', 'notFound', {
                ':attribute': 'Conversation',
            }),
            404
        )
    }

    body.conversation_id = conversation.id
    body.sender_id = user.id

    const message = await MessageModel.create(request)
    /* if the conversation is archived, change it to active*/
    await ConversationModel.update({
        params: {
            id: body.conversationId,
        },
        body: {
            status: 'active',
        },
    })

    await MessageVisibilityModel.create({
        body: {
            message_id: message?.id,
            user_id: user.id,
            is_visible: true,
        },
    })

    /* send response */
    return response.json({
        message: translate('messages', 'success', {
            ':attribute': 'Message has',
            ':action': 'added',
        }),
    })
}
