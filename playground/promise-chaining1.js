require('../src/db/mongoose')
const Task = require("../src/models/task")

/*
Task.deleteOne({_id: new ObjectID('5fca527602626048a4d8a5fb')}).then((result)=>{
    console.log(result)
    return Task.countDocuments({completed: false})
}).then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})*/

// ASYNC AND AWAIT Makes the code, so clean and easily managable!

const deleteTaskAndCount = async (_id,completed) => {
    await Task.deleteOne({_id})
    const count = await Task.countDocuments({completed})
    return count
}

deleteTaskAndCount('5fca523602626048a4d8a5f9',false).then((count)=>{
    console.log(count)
}).catch((error)=>{
    console.log(error)
})