import AppValidationError from '../exceptions/AppValidationError'

import translate from './translate'

export default async (data, entity) => {
    if (!data) {
        throw new AppValidationError(
            translate('errors', 'notFound', {
                ':attribute': entity,
            }),
            404
        )
    }
}
