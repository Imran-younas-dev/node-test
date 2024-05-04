import { AbstractModel } from './AbstractModel'

/** import helpers */
import translate from '../helpers/translate'

export default (sequelize, DataTypes) => {
    class User extends AbstractModel {
        static associate(models) {}
    }
    User.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            role_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                validate: {
                    notNull: {
                        args: true,
                        msg: translate('validations', 'required', {
                            ':attribute': 'Role Id',
                        }),
                    },
                },
            },
            role_title: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            full_name: {
                type: DataTypes.STRING(100),
            },
            email: {
                type: DataTypes.STRING(100),
            },
            password: {
                type: DataTypes.STRING(100),
            },
            status: {
                type: DataTypes.ENUM('pending', 'active', 'blocked'),
                defaultValue: 'active',
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['pending', 'active', 'blocked']],
                        msg: translate('validations', 'valid', {
                            ':attribute': 'status',
                        }),
                    },
                },
            },
            verification_code: {
                type: DataTypes.STRING(100),
            },
            password_token: {
                type: DataTypes.STRING(100),
            },
            verified_at: {
                type: DataTypes.DATE,
            },
            activated_at: {
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: 'users',
            timestamps: true,
        }
    )

    return User
}
