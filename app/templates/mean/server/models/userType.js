var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserTypeSchema   = new Schema({
    name: { type: String, unique: true },
    enabledModules: [{ type: String, unique: true }],
});

module.exports = mongoose.model('UserType', UserTypeSchema);