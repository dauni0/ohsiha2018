
var Blog            = require('../models/blog')

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        Blog.find({}, function(err, blogs) {
            res.render('index.ejs', { blogs: blogs});
        });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    app.get('/login', function(req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the register form
    app.get('/signup', function(req, res) {
        res.render('signup', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    app.get('/profile', isLoggedIn, function(req, res) {
        Blog.find({author: req.user.email}, function(err, blogs) {
            res.render('profile.ejs', {
                user : req.user,
                blogs: blogs
            });
        });
    });

    // =====================================
    // BLOGS ===============================
    // =====================================
    app.post('/addblog', isLoggedIn, function(req, res) {
        var blog = new Blog({
            title        : req.body.title,
            author       : req.user.email,
            text         : req.body.body
        });
        blog.save();
        res.redirect(req.get('referer'));
    });

    app.post('/editblog/:id', isLoggedIn, function(req, res) {
        var id = req.params.id;
        Blog.findOne({_id : id}, function(err, blog) {
            blog.text = req.body.body;
            blog.save();
            res.redirect(req.get('referer'));
        });
    });

    app.post('/delete/:id', isLoggedIn, function(req, res) {
        var id = req.params.id;
        Blog.deleteOne({_id : id}, function(err, blog) {
            res.redirect(req.get('referer'));
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}