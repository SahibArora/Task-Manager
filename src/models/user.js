const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error('Please enter valid email!');
            }
        }
    }
    ,
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age nust be positive number!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain password itself');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'Thisiscool')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

// userSchema.statics, will make the 'findByCredentials' part of userSchema
// More like static fnction, for whole table
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('Invalid Login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Invalid Login!')
    }

    return user
}

// Hash Plain text password before saving 
userSchema.pre('save',async function (next) {
    const user = this //current user which is going to be saved!

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next() // ends the middleware
})

// Delete User task, when user is removed! {middleware}

userSchema.pre('remove', async function (next){
    const user = this
    
    await Task.deleteMany({ owner: user._id})

    next()
})

const User = mongoose.model('Users',userSchema)  

module.exports = User