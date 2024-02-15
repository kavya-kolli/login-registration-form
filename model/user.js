const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema(
    {
        Username:String,
        password:String,
    });
    UserSchema.plugin(passportLocalMongoose);
    module.exports = mongoose.model("User", UserSchema);