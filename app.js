var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	multer = require('multer'),
	User = require("./models/user");

var url = "mongodb://rutu-navigus:hello1121@ds019926.mlab.com:19926/heroku_4lt4tfjq" || "mongodb://localhost/auth_demo_app";
mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect("mongodb://rutu-navigus:hello1121@ds019926.mlab.com:19926/heroku_4lt4tfjq",{useNewUrlParser: true, useUnifiedTopology: true});

mongoose.set('useFindAndModify', true);
mongoose.set('useCreateIndex', true);

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
    User.find({}, (err,data)=>{
             if(err){
                 console.log(err)
             }
            if(data){
                //console.log("my files : "+JSON.stringify(data[0]));
                res.render('fileUpload',{message:" "})
            }
           else{
               res.render('secret')
           }
    })
})

app.post('/fileUpload',upload.single('userFile'),(req,res)=>{
		var usern = req.user.username;
		var path= 'public/uploads/'+req.file.originalname;
		var filename= req.file.originalname;
    User.findOneAndUpdate({"username":usern},{$set:{docpath:path,docname:filename}},{new: true},(err, doc) =>{
			if (err) {
	        console.log("Something wrong when updating data!");
	    }
			res.render('fileUpload',{message: "File uploaded successfully"})
	    console.log(doc);
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
