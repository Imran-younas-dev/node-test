import { intersection } from 'lodash'

export default (...scopes) => {
    return (request, response, next) => {
        if (!intersection(scopes, request.authInfo.scopes).length) {
            return response.status(403).send('Forbidden')
        }
        return next()
    }
}
