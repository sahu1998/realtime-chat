const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const userSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        image: {
            type: String, 
            default: `http://localhost:8000/assets/user_placeholder.jpg`
        }
    },
    {
        timestamps: true
    }
)
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.pre("save", function (next) {
    if (this.password) {
        let salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS)); 
        let hash = bcrypt.hashSync(this.password, salt); 
        console.log(hash);
        this.password = hash;
    }
    next();
  })

const User = mongoose.model("users", userSchema)

module.exports = User