var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/auth_demo_app',{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb://rutu-navigus:hello1121@ds019926.mlab.com:19926/heroku_4lt4tfjq',{useNewUrlParser: true, useUnifiedTopology: true});

//mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//mongoose.set('useUnifiedTopology', true);

var db = mongoose.connection;

var DocSchema = mongoose.Schema({
  "docpath" : String,
});

module.exports = mongoose.model('docs', DocSchema);
