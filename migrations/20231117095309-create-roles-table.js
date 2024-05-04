'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('roles', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            scopes: {
                type: Sequelize.JSON,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('roles')
    },
}
