import { keys, intersection, difference, startCase } from 'lodash'
import { Model as SequalizeModel } from 'sequelize'
import translate from '../helpers/translate'
import AppValidationError from '../exceptions/AppValidationError'

import { getDataFromRedis, setDataToRedis } from '../config/redis'

export class AbstractModel extends SequalizeModel {
    static init(attributes, options = {}) {
        super.init(attributes, options)

        this.associate()
    }

    static async view(id, options = {}) {
        let data = await getDataFromRedis(`${this.getTableName()}-${id}`)

        if (!data) {
            if (isNaN(id)) {
                data = await this.findOne(options)
            } else {
                data = await this.findByPk(id, options)
            }

            if (id) {
                await setDataToRedis(`${this.getTableName()}-${id}`, data)
            }
        }

        return data
    }

    static paginate(
        { query },
        options = {},
        exclude = null,
        withCount = false,
        subQuery = false
    ) {
        // Attributes handling
        if (query.attributes) {
            options.attributes = intersection(
                keys(this.rawAttributes),
                query.attributes.split(',')
            )

            // remove columns from attributes
            options.attributes = difference(options.attributes, exclude)
        } else {
            // handling of attributes that needs to be excluded from response
            options.attributes = {
                exclude,
            }
        }

        options.attributes = options.attributes.length
            ? options.attributes
            : { exclude }

        // Order handling
        const orderBy = query?.orderBy ?? 'id'

        const order = ['asc', 'desc', 'ASC', 'DESC'].includes(query.order)
            ? query.order
            : 'asc'

        options.order = [[orderBy, order]]

        // if ordering literal is passed from controller
        if (query.orderingLiteral) {
            options.order = []
            options.order.push(query.orderBy)
        }
        /**
         * REASON: we don't have id as a column in tables which we didn't create such as bills, bills_versions
         */
        // if (query.orderBy !== 'id') {
        //     options.order.push(['id', order])
        // }

        if (query.customeOrder) {
            options.order = query.customeOrder
        }

        // Paginaton handling
        if (
            query.paginate === 'true' ||
            query.paginate === true ||
            query.paginate === '1' ||
            query.paginate === 1
        ) {
            options.limit =
                parseInt(query.limit) > 0 ? parseInt(query.limit) : 10

            const page = parseInt(query.page) > 0 ? parseInt(query.page) : 1

            options.offset = (page - 1) * options.limit
        }

        // if subQuery is passed from controller
        if (subQuery) {
            options.attributes = subQuery
        }

        // Return response
        if (withCount)
            return this.findAndCountAll(
                {
                    ...options,
                    distinct: true,
                },
                {
                    raw: true,
                }
            )

        return this.findAll(options, { raw: true })
    }

    static async createBulk(body, options = {}) {
        if (!options.transaction) {
            return await this.sequelize.transaction(async (transaction) => {
                return await super.bulkCreate(body, {
                    ...options,
                    transaction,
                })
            })
        }
        return await super.bulkCreate(body, {
            ...options,
        })
    }

    static async create({ body }, options = {}) {
        if (!options.transaction) {
            return await this.sequelize.transaction(async (transaction) => {
                return await super.create(body, {
                    ...options,
                    transaction,
                })
            })
        }
        return await super.create(body, {
            ...options,
        })
    }

    static async remove(label, id) {
        const rowsAffected = await super.destroy({
            where: {
                id,
            },
        })

        if (!rowsAffected) {
            throw new AppValidationError(
                translate('validations', 'notFound', {
                    ':attribute': label,
                }),
                404
            )
        }
    }

    static async update({ params, body }, options = {}) {
        return await this.sequelize.transaction(async (transaction) => {
            if (!this.options.transaction) {
                const model = await super.update(
                    { ...body },
                    {
                        where: { ...params },
                        returning: true,
                        raw: true,
                        transaction,
                        ...options,
                    }
                )

                await setDataToRedis(
                    `${this.getTableName()}-${model.id}`,
                    model
                )
                return model
            }
            const model = await super.update(
                { ...body },
                {
                    where: { ...params },
                    returning: true,
                    raw: true,
                    ...options,
                }
            )
            await setDataToRedis(`${this.getTableName()}-${model.id}`, model)
            return model
        })
    }

    static async updateByPk(id, { body }, options = {}) {
        const model = await this.findByPk(id, { ...options })
        if (!model) {
            throw new AppValidationError(
                translate('errors', 'notFound', {
                    ':attribute': startCase(this.getTableName()),
                }),
                404
            )
        }

        if (!options.transaction) {
            return await this.sequelize.transaction(async (transaction) => {
                await model.update(body, { transaction })
                await setDataToRedis(`${this.getTableName()}-${id}`, model)
                return model
            })
        }

        await model.update(body, { ...options })
        await setDataToRedis(`${this.getTableName()}-${id}`, model)

        return model
    }

    static async updateBulk({ params, body }) {
        return await this.sequelize.transaction(async (transaction) => {
            return await super.update(body, {
                where: {
                    ...params, // with an id from the list
                },
                transaction,
            })
        })
    }
}
