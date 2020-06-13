var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	multer = require('multer'),
	User = require("./models/user"),
	Docs = require("./models/documents");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/auth_demo_app");

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


// ROUTES for user login and registration


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

// ROUTES for file upload

var storage = multer.diskStorage({
    destination:function(req,file,cb){
         cb(null,'./public/uploads')
    },
    filename(req,file,cb){
        cb(null,file.originalname)
    }
})

var upload = multer({storage:storage});

app.use(express.static('public'))

//var findquery = Docs.DocSchema.find();


	// findquery.exec(function(err, data) {
	// 	console.log(data.length);
	// 	if(err) throw err;
	// 	Docs.DocSchema.find().distinct('_id', function(err, Response) {
	// 		 		  if (err) return next(err);
	// 					res.render('fileUpload', { title: 'My Files', records: data, recordlen:Response.length});
	// 	})
	// 	//res.json(response);
	// 	//res.render('fileUpload', { title: 'file upload', msg:req.query.msg, doclist : data });
	// });
////////////////////////////////////////////////////////////////////
// app.get('/fileUpload',function(req,res,next){
//     Docs.find({},['docpath'], (err,data)=>{
//              if(err){
//                  console.log(err)
//              }
//             if(data){
//                 console.log(data)
//                 res.render('fileUpload',{data:data})
//             }
//            else{
//                res.render('fileUpload',{data:{}})
//            }
//     })
// })
/////////////////////////////////////////////////////////////////
app.get('/fileUpload',function(req,res){
	Docs.find({}, ['docpath'], {sort:{ _id: -1} }, function(err, data) {
		if(err) throw err;
    res.render('fileUpload', { title: 'My Files', msg:req.query.msg, doclist : data, recordlen:data.length });
  });
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
