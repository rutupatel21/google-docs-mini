var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	multer = require('multer'),
	User = require("./models/user"),
	Docs = require("./models/documents.js");

mongoose.connect("mongodb://localhost/auth_demo_app",{useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', true);
mongoose.set('useCreateIndex', true);
//mongoose.set('useUnifiedTopology', true);

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("express-session")({
	secret: "Rusty is a dog",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

///////////////////////////////////////////////////////////////////

// ROUTES for user login and registration

///////////////////////////////////////////////////////////////////
// Showing home page
app.get("/", function (req, res) {
	res.render("home");
});

// Showing secret page
app.get("/fileUpload", isLoggedIn, function (req, res) {
	res.render("fileUpload");
});

// Showing register form
app.get("/register", function (req, res) {
	res.render("register");
});

// Handling user signup
app.post("/register", function (req, res) {
	var username = req.body.username
	var password = req.body.password
	User.register(new User({ username: username }),
			password, function (err, user) {
		if (err) {
			console.log(err);
			return res.render("register");
		}

		passport.authenticate("local")(
			req, res, function () {
			res.render("fileUpload");
		});
	});
});

//Showing login form
app.get("/login", function (req, res) {
	res.render("login");
});

//Handling user login
app.post("/login", passport.authenticate("local", {
	successRedirect: "/fileUpload",
	failureRedirect: "/login"
}), function (req, res) {
});

//Handling user logout
app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});

// file upload

var storage = multer.diskStorage({
    destination:function(req,file,cb){
         cb(null,'./public/uploads')
    },
    filename(req,file,cb){
        cb(null,file.originalname)
    }
})

var upload = multer({storage:storage});

app.use(express.static('public'));


////////////////////////////////////////////////////////////////////

// Routes for file upload

///////////////////////////////////////////////////////////////////

app.get('/fileUpload',function(req,res,next){
    Docs.find({}, (err,data)=>{
             if(err){
                 console.log(err)
             }
            if(data){
                //console.log("my files : "+JSON.stringify(data[0]));
                res.render('fileUpload',{title: "Your Files", data:data})
            }
           else{
               res.render('secret')
           }
    })
})

app.post('/fileUpload',upload.single('userFile'),(req,res)=>{
		var x= 'public/uploads/'+req.file.originalname;
    var docs = new Docs({
        docpath:x
    })
    docs.save((err,data)=>{
         if(err){
             console.log(err)
         }
         else{
             console.log('data',data)
            res.redirect('/fileUpload')
         }
    })
})

// other functions

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/login");
}

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Server Has Started!");
});
