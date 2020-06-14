var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/auth_demo_app',{useNewUrlParser: true, useUnifiedTopology: true});

//mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//mongoose.set('useUnifiedTopology', true);


var passportLocalMongoose = require('passport-local-mongoose');
var db = mongoose.connection;

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username : String,
  password : String,
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
module.exports.createUser = function(newUser) {newUser.save();}
