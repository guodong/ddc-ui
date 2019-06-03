export function isNull(object) {
    if (
        object === null ||
        typeof object === 'undefined' ||
        object === '' ||
        JSON.stringify(object) === '[]'
    ) {
        return true;
    }
    return false;
}