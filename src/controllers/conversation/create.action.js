import translate from '../../helpers/translate'
import { ConversationModel, UserModel } from '../../models'

import dayjs from '../../helpers/dayjs'
import { Op } from 'sequelize'
/* Create agreement field
 * @description This method will create single agreement field
 * @input data of agreement field to be created
 * @return (String) message
 */
export const create = async (request, response) => {
    const {
        body: { userId },
        user: { id },
    } = request

    const isChat = await ConversationModel.findAll({
        where: {
            [Op.and]: {
                sender_id: id,
                reciever_id: userId,
            },
        },
        include: {
            model: UserModel,
            as: 'user',
            required: false,
            attributes: ['id', 'full_name', 'status'],
        },
    })
    if (isChat?.length > 0) {
        return response.json({
            isChat,
        })
    }

    const conversation = await ConversationModel.create({
        body: {
            created_by: id,
            status: 'active',
            last_messaged_at: dayjs().format(),
            sender_id: id,
            reciever_id: userId,
        },
    })

    /* send response */
    return response.json({
        message: translate('messages', 'success', {
            ':attribute': 'Conversation has',
            ':action': 'created',
        }),
        conversation,
    })
}
