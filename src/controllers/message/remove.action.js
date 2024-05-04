/* import helpers */
import translate from '../../helpers/translate'
import { MessageModel, MessageVisibilityModel } from '../../models'
import AppValidationError from '../../exceptions/AppValidationError'

/* Remove transaction
 * @description This method will delete transaction
 * @input id of transaction to be deleted
 * @return (String) message
 */

export const remove = async (request, response) => {
    const {
        user,
        query: { deleteWith },
        params: { id },
    } = request

    const message = await MessageModel.findOne({
        where: {
            id,
            sender_id: user?.id,
        },
        attributes: ['id'],
    })

    if (!message) {
        throw new AppValidationError(
            translate('errors', 'notFound', {
                ':attribute': 'Message',
            }),
            404
        )
    }

    /* Task 5: 'Delete for Me' Feature
       Implement a feature to allow users to delete their own messages. */
    if (deleteWith === 'me') {
        await MessageVisibilityModel.update({
            params: {
                message_id: message?.id,
                user_id: user?.id,
            },
            body: {
                is_visible: false,
            },
        })
    }
    /* Task 6: 'Delete for Everyone' Feature
      Develop a feature to allow users to delete messages for everyone in the   
       chat */
    if (deleteWith === 'everyone') {
        await MessageModel.destroy({
            where: {
                id,
                sender_id: user?.id,
            },
        })
        await MessageVisibilityModel.destroy({
            where: {
                message_id: message?.id,
                user_id: user?.id,
            },
        })
    }

    response.json({
        message: translate('messages', 'success', {
            ':attribute': 'Message has',
            ':action': `removed from ${deleteWith === 'me' ? 'me' : 'everyone'}`,
        }),
    })
}
