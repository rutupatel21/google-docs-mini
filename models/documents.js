var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/auth_demo_app');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


//var passportLocalMongoose = require('passport-local-mongoose');
var db = mongoose.connection;

var DocSchema = mongoose.Schema({
  "docpath" : String,
});

module.exports = mongoose.model('docs', DocSchema);
