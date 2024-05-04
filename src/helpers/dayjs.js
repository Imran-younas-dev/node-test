import dayjs from 'dayjs'

// additional dayjs plugins
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(tz)

export default dayjs
