import { AbstractModel } from './AbstractModel'
import { TokenModel } from '.'
export default (sequelize, DataTypes) => {
    class OAuthRefreshToken extends AbstractModel {
        static associate(models) {
            // define association here
            OAuthRefreshToken.belongsTo(TokenModel, {
                foreignKey: 'access_token_id',
            })
        }
    }
    OAuthRefreshToken.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            access_token_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },

            revoked_at: {
                type: DataTypes.DATE,
                defaultValue: null,
            },
            expires_at: {
                type: DataTypes.DATE,
                defaultValue: null,
            },
        },
        {
            sequelize,
            modelName: 'oauth_refresh_tokens',
            timestamps: true,
        }
    )

    return OAuthRefreshToken
}
