'use strict'
import bcrypt from 'bcrypt'

import data from './data/users'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        for (let index = 0; index < data.length; index++) {
            const user = data[index]
            user.password = await bcrypt.hash(user?.password, 10)
        }
        await queryInterface.bulkInsert('users', data, {
            ignoreDuplicates: true,
        })
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('users', null, {})
    },
}
