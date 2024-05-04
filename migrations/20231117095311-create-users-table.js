'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            role_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            role_title: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            full_name: {
                type: Sequelize.STRING(100),
            },
            email: {
                type: Sequelize.STRING(100),
            },
            password: {
                type: Sequelize.STRING(100),
            },
            status: {
                type: Sequelize.ENUM(),
                values: ['pending', 'active', 'blocked'],
                defaultValue: 'active',
                allowNull: false,
            },
            verification_code: {
                type: Sequelize.STRING(100),
            },
            password_token: {
                type: Sequelize.STRING(100),
            },
            verified_at: {
                type: Sequelize.DATE,
            },
            activated_at: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('users')
    },
}
