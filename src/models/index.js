import Sequelize from 'sequelize'
import { createClient } from '../config/redis'

import User from './User'
import Token from './OAuthToken'
import RefreshToken from './OAuthRefreshToken'
import Role from './Role'
import Conversation from './Conversation'
import Message from './Message'
import MessageVisibility from './MessageVisibility'

const mysql = require('../config/database')

export const sequelize = new Sequelize(
    mysql.database,
    mysql.username,
    mysql.password,
    mysql
)
/*
 * connect to the redis wait for the connection then proceed
 */
createClient()

export default sequelize
export const TokenModel = Token(sequelize, Sequelize.DataTypes)
export const RoleModel = Role(sequelize, Sequelize.DataTypes)
export const UserModel = User(sequelize, Sequelize.DataTypes)
export const MessageVisibilityModel = MessageVisibility(
    sequelize,
    Sequelize.DataTypes
)
export const MessageModel = Message(sequelize, Sequelize.DataTypes)
export const ConversationModel = Conversation(sequelize, Sequelize.DataTypes)
export const RefreshTokenModel = RefreshToken(sequelize, Sequelize.DataTypes)
