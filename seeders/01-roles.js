'use strict'
import data from './data/roles'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('roles', data, {
            updateOnDuplicate: ['scopes'],
        })
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('roles', null, {})
    },
}
