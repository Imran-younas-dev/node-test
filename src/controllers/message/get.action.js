import { Op } from 'sequelize'
import {
    ConversationModel,
    MessageModel,
    UserModel,
    MessageVisibilityModel,
} from '../../models'
import AppValidationError from '../../exceptions/AppValidationError'
import translate from '../../helpers/translate'
export const get = async (request, response) => {
    let {
        query: { keyword, conversationId, orderBy, order },
        user: { id },
    } = request

    if (!order) request.query.order = 'ASC'
    if (!orderBy) request.query.orderBy = 'id'

    let where = {}
    const conversation = await ConversationModel.findOne({
        where: {
            id: conversationId,
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

    keyword = keyword?.trim()
    if (keyword) {
        where = {
            content: {
                [Op.like]: `%${keyword}%`,
            },
        }
    }

    const data = await ConversationModel.paginate(request, {
        where: {
            id: conversationId,
            [Op.or]: {
                sender_id: id,
                reciever_id: id,
            },
        },
        include: [
            {
                model: UserModel,
                as: 'user',
                required: true,
                attributes: ['full_name', 'status'],
            },
            {
                model: MessageModel,
                where,
                as: 'messages',
                required: false,
                attributes: ['id', 'content', 'sender_id'],
                include: [
                    {
                        model: UserModel,
                        as: 'messageUser',
                        required: true,
                        attributes: ['full_name'],
                    },
                    {
                        model: MessageVisibilityModel,
                        as: 'visibility',
                        required: true,
                        where: {
                            [Op.or]: [
                                { user_id: id, is_visible: true },
                                { user_id: { [Op.ne]: id } },
                            ],
                        },
                        attributes: [],
                    },
                ],
            },
        ],
    })
    /* send response */
    return response.json({
        data,
    })
}
