module.exports = {
    selected: function (a, b) {
        if (a === b ) return 'selected'
    },
    active: function (a, b) {
        const A = String(a)
        if (A === b ) return 'active'
    }
}