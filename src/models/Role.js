import { AbstractModel } from './AbstractModel'
export default (sequelize, DataTypes) => {
    class Role extends AbstractModel {
        static associate(models) {}
    }
    Role.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            scopes: {
                type: DataTypes.JSON,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'roles',
            timestamps: true,
        }
    )

    return Role
}
