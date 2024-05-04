import dayjs from '../helpers/dayjs'

export default (date, format) => {
    return dayjs(date, format).isValid()
}
