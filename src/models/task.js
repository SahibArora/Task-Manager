const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    //For keeping record of who created it.
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    }
},{
    timestamps: true
})

const Task = mongoose.model('Tasks', taskSchema)

module.exports = Task