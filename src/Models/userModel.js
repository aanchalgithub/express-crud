const mongoose = require('mongoose')
const roles = ["admin","user"]

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        minlength : 3
    },
    email : {
        type: String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        default : "user",
        enum : roles
    }
},
{
    timestamps : true
}
)


const User = new mongoose.model("user",UserSchema)
module.exports = User