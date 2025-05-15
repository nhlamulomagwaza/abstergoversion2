const mongoose= require('mongoose');
const bcrypt = require('bcrypt');



const usersSchema= new mongoose.Schema({

     username:{

        type:String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
       
     },
     password:{

        type:String, 
        required:true,

     },
    
} ,{timestamps: true},);


usersSchema.pre('save', async function (next) {
   const user = this;
 
   // Only hash the password if it has been modified (or is new)
   if (user.isModified('password')) {
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(user.password, salt);
     user.password = hashedPassword;
   }
 
   next();
 });

module.exports= mongoose.model('Users', usersSchema);