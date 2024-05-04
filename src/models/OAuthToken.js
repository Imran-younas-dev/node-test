import { AbstractModel } from './AbstractModel'
export default (sequelize, DataTypes) => {
    class OAuthToken extends AbstractModel {
        static associate(models) {}
    }
    OAuthToken.init(
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            scopes: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            user_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                foreignKey: true,
            },
            revoked_at: {
                type: DataTypes.DATE,
            },
            expires_at: {
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: 'oauth_tokens',
            timestamps: true,
            underscored: true,
        }
    )

    return OAuthToken
}
