'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('messages', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            sender_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                // references: {
                //     model: 'Users',
                //     key: 'id',
                // },
                // onUpdate: 'CASCADE',
                // onDelete: 'CASCADE',
            },
            content: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            conversation_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                // references: {
                //     model: 'Chats',
                //     key: 'id',
                // },
                // onUpdate: 'CASCADE',
                // onDelete: 'CASCADE',
            },
            is_visible: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
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
        await queryInterface.dropTable('messages')
    },
}
