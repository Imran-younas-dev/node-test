import translate from '../helpers/translate'
import { AbstractModel } from './AbstractModel'

export default (sequelize, DataTypes) => {
    class Message extends AbstractModel {
        static associate() {
            this.belongsTo(sequelize.models.users, {
                foreignKey: 'sender_id',
                sourceKey: 'id',
                as: 'messageUser',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            })
            this.hasMany(sequelize.models.message_visibilities, {
                foreignKey: 'message_id',
                sourceKey: 'id',
                as: 'visibility',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            })
        }
    }
    Message.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            sender_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                validate: {
                    notNull: {
                        args: true,
                        msg: translate('validations', 'required', {
                            ':attribute': 'Sender Id',
                        }),
                    },
                },
            },
            conversation_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                validate: {
                    notNull: {
                        args: true,
                        msg: translate('validations', 'required', {
                            ':attribute': 'Chat Id',
                        }),
                    },
                },
            },
            content: {
                type: DataTypes.TEXT(),
                allowNull: false,
                validate: {
                    notNull: {
                        args: true,
                        msg: translate('validations', 'required', {
                            ':attribute': 'Content',
                        }),
                    },
                },
            },
            is_visible: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'messages',
            timestamps: true,
        }
    )

    return Message
}
