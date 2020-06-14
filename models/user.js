var mongoose = require('mongoose');
var url = "mongodb://rutu-navigus:hello1121@ds019926.mlab.com:19926/heroku_4lt4tfjq" || "mongodb://localhost/auth_demo_app";
mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});
//mongoose.connect('mongodb://rutu-navigus:hello1121@ds019926.mlab.com:19926/heroku_4lt4tfjq',{useNewUrlParser: true, useUnifiedTopology: true});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var passportLocalMongoose = require('passport-local-mongoose');
var db = mongoose.connection;

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username : String,
  password : String,
  docpath: String,
  docname : String,

});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
module.exports.createUser = function(newUser) {newUser.save();}
