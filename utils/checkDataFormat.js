module.exports = {
  checkString: (string) => {
    if (string === undefined || string.trim() === '') return false
    return true
  },
  checkNumber: (number) => {
    if (number === undefined || isNaN(Number(number))) return false
    if (number < 0) return false
    return true
  }
}