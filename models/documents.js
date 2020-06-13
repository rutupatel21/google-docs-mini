var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/docs');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


var passportLocalMongoose = require('passport-local-mongoose');
var db = mongoose.connection;

var Schema = mongoose.Schema;

var docSchema = new Schema({
  path:  { type: String },
  caption: { type: String }
  });
module.exports = mongoose.model('Docs', docSchema);
