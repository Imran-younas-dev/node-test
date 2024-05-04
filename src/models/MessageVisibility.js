import translate from '../helpers/translate'
import { AbstractModel } from './AbstractModel'

export default (sequelize, DataTypes) => {
    class MessageVisibility extends AbstractModel {
        static associate() {}
    }
    MessageVisibility.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            message_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                validate: {
                    notNull: {
                        args: true,
                        msg: translate('validations', 'required', {
                            ':attribute': 'Message Id',
                        }),
                    },
                },
            },
            user_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                validate: {
                    notNull: {
                        args: true,
                        msg: translate('validations', 'required', {
                            ':attribute': 'User Id',
                        }),
                    },
                },
            },
            is_visible: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
                validate: {
                    notNull: {
                        args: true,
                        msg: translate('validations', 'required', {
                            ':attribute': 'Is Visible',
                        }),
                    },
                },
            },
        },
        {
            sequelize,
            modelName: 'message_visibilities',
            timestamps: true,
        }
    )

    return MessageVisibility
}
