module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('message_visibilities', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            message_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            is_visible: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
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
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('message_visibilities')
    },
}
