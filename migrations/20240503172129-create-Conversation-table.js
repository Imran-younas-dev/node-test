'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('conversations', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            created_by: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            last_messaged_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            sender_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            reciever_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM,
                values: ['active', 'archived'],
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
        await queryInterface.dropTable('conversations')
    },
}
