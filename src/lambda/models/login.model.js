const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    quote: {
        type: String
    }
}, {
    timestamps: true, //created filed automatically
});

const LoginModel = mongoose.model("LoginModel", loginSchema);

module.exports = LoginModel;