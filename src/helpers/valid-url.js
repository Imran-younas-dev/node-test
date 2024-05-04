/**
 * Returns valid URL.
 *
 * @param {string} url URL to be verified.
 * @return {string} if URL is valid else false.
 */
export default (url) => {
    try {
        return new URL(url)
    } catch (_) {
        return false
    }
}
