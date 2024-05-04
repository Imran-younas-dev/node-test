'use strict'

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('oauth_refresh_tokens', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            access_token_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                foreignKey: true,
            },
            revoked_at: {
                type: Sequelize.DATE,
                defaultValue: null,
            },
            expires_at: {
                type: Sequelize.DATE,
                defaultValue: null,
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
        await queryInterface.dropTable('oauth_refresh_tokens')
    },
}
