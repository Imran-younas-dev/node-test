import lang from '../lang'
import { get, isObject, isString, replace } from 'lodash'

export default (type, key, replacement) => {
    let text = get(lang[type], key)

    if (replacement && isObject(replacement)) {
        for (const i in replacement) {
            if (isString(replacement[i])) {
                text = replace(text, i, replacement[i])
            }
        }
    }

    return text
}
