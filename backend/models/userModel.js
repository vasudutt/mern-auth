const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    verified: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
      default: false
    }
},{
    timestamps: true,
});

userSchema.pre('save', async function(next){
  if(this.isModified('password')){
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
  }

  next();
});

userSchema.methods.comparePassword = async function (password){
  const result = await bcrypt.compareSync(password, this.password);
  return result;
}

module.exports = mongoose.model('User', userSchema)