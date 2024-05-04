'use strict'

/** @type {import('sequelize-cli').Migration} */
'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('oauth_tokens', {
            id: {
                autoIncrement: true,
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            scopes: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            user_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            revoked_at: {
                type: Sequelize.DATE,
            },
            expires_at: {
                type: Sequelize.DATE,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('oauth_tokens')
    },
}
