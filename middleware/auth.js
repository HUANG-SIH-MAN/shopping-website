module.exports = {
    authenticator: (req, res, next) => {
        if (req.isAuthenticated()) return next()
        req.flash('error', '使用者必須登入才能使用!!')
        res.redirect('/users/login')
    }
}