const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let Register = new Schema({
name: {
    type: String
},
email: {
    type: String,
    registered:true,
    unique : true,
    match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
},
gender: {
    type: String
},
phone_number:{
    type: String
},
alternate_number: {
    type: String
},
dob: {
    type: String
},
photo: {
    type: String,
    required:true
},
password : {
    type : String
},
security_que: {
    type: String
},
security_ans: {
    type: String
},
});

const user= mongoose.model('Register', Register);
module.exports = user;