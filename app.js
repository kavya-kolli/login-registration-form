var express = require("express"),
mongoose = require("mongoose"),
bodyparser = require("body-parser"),
passport = require("passport"),
LocalStrategy = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
user = require("./model/user");

mongoose.connect("mongodb://127.0.0.1:27017/flowershop");

var app = express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true}));

app.use(require("express-session")
({
     secret: "Rusty is a dog",
     resave: false,
     saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.get("/", function (req, res){
    res.render("home");
});

app.get("/profile",isLoggedIn, function(req, res)
{
    res.render("profile");
}); 
app.get("/login", function(req, res)
{
    res.render("login");
}); 
app.post("/login", passport.authenticate("local",{
      successRedirect: "/profile",
      failureRedirect: "/login"
}), function(req,res){
    
})

function isLoggedIn(req, res, next)
{
    if (req.isAuthenticated())
    return next();
res.redirect("/login");
}

app.get("/register", function (req,res)
{
    res.render("register");
});

app.post("/register", function (req,res)
{
    var username = req.body.username
    var password = req.body.password
    user.register(new user({username: username}),
    password,function(err, user)
    {
      if(err){
        console.log(err);
        return res.render("register");
      }

      passport.authenticate("local")(
        function (req,res){
            res.render("profile");
        });
    });
});
//handling user logout
app.get("/logout", function(req, res, next){
    req.logout(function(err){
        if(err)
        {
            return next(err);
        }
        res.redirect("/");
    });
});

var port = process.env.PORT || 8080;
app.listen(port, function (){
    console.log("server has started!");
});