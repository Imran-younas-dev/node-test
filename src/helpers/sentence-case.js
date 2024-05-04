import { upperFirst, lowerCase } from 'lodash'

export default (field) => {
    return upperFirst(lowerCase(field))
}
