var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProfileSchema   = new Schema({
    userType: {type: mongoose.Schema.Types.ObjectId, ref: 'UserType'}
});

module.exports = mongoose.model('Profile', ProfileSchema);