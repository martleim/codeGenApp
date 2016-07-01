var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    email: { type: String, required: true, unique: true },  
    userName: { type: String, required: true, unique: true },  
    //password: { type: String, required: true },  
    name: { type: String, required: true },  
    surName: { type: String, required: true },  
    birthday: { type: Date, required: true },
    telephone: { type: String, required: true },  
    address: { type: String, required: true },  
    modified: { type: Date, default: Date.now },
	userProfiles : [{type: mongoose.Schema.Types.ObjectId, ref: 'Profile'}]
});

module.exports = mongoose.model('User', UserSchema);