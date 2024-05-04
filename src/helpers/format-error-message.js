import { union } from 'lodash'

export const formatMessage = (errors) => {
    const error = []
    for (let mainIterator = 0; mainIterator < errors.length; mainIterator++) {
        const mainBody = errors[mainIterator].split('\n')
        for (
            let secondIterator = 0;
            secondIterator < mainBody.length;
            secondIterator++
        ) {
            const secondMsg = mainBody[secondIterator].split(':').pop()

            error.push(secondMsg)
        }
    }

    return union(error)
}
