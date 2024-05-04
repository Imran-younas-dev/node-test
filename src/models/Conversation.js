import { AbstractModel } from './AbstractModel'
import translate from '../helpers/translate'

export default (sequelize, DataTypes) => {
    class Conversation extends AbstractModel {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(sequelize.models.users, {
                foreignKey: 'id',
                sourceKey: 'reciever_id',
                as: 'user',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            })
            this.hasMany(sequelize.models.messages, {
                foreignKey: 'conversation_id',
                sourceKey: 'id',
                as: 'messages',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            })
        }
    }
    Conversation.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            last_messaged_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            created_by: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            sender_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            reciever_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM,
                values: ['active', 'archived'],
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['active', 'archived']],
                        msg: translate('validations', 'valid', {
                            ':attribute': 'status',
                        }),
                    },
                },
            },
        },
        {
            sequelize,
            modelName: 'conversations',
            timestamps: true,
        }
    )

    return Conversation
}
