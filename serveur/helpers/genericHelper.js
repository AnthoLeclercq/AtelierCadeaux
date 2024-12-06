function isNullOrEmpty(object) {
    if (object === null)
        return true;
    if (typeof object === "undefined")
        return true;
    if (typeof object === "string" && object.trim() === '' && object === null)
        return true;
    if (Array.isArray(object) && object.length === 0 && object === null)
        return true;
    if (typeof object === "object" && Object.keys(object).length === 0 && object === null)
        return true;

    return false;
}

module.exports = {
    isNullOrEmpty
};