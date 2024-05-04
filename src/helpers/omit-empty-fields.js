import { omitBy, isEmpty, isNumber } from 'lodash'

export const omitEmptyValues = (data) => {
    return omitBy(data, (value) => {
        if (isNumber(value)) {
            // Update if the value is a number
            return false
        }

        return isEmpty(value)
    })
}
