const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const taskRouter = new express.Router()


/*taskRouter.get('/task/add', (req, res) => {
    try{
        res.sendFile(path.join(__dirname,'../html/deleteUser.html'))
    }catch(e){
        res.status(500).send(e)
    }
})*/

taskRouter.post('/task/add', auth, async (req,res)=>{

    // ------------ UPDATED TO USE ASYNC AND AWAIT

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
/*
    task.save().then((task)=>{
        res.status(201).send(task)
    }).catch((error)=>{
        res.status(400).send(error)
    })
*/
});

//    /tasks?completed=true - Filteration
//    /tasks?limit=2&skip=1 - Pagination
//    /tasks?sortBy=createdAt_desc              _ or : can add another attribute to sort, like ascending here

taskRouter.get('/tasks', auth, async (req,res)=>{

    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const part = req.query.sortBy.split(':')
        sort[part[0]] = part[1] === 'desc' ? -1 : 1
    }
    // ------------ UPDATED TO USE ASYNC AND AWAIT

    try{

        // This will find task of the current user, logged in.
        // Two ways to find the related tasks to individual tasks.
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate() 
        res.status(200).send(req.user.tasks)

        /*
        var tasks = await Task.find({owner: req.user._id})
        res.status(200).send(tasks)
        */

    }catch(e){
        res.status(404).send()
    }
/*
    Task.find({}).then((result)=>{
        if(!result){
            res.status(404).send()
        }
        res.send(result)
    }).catch((error)=>{
        res.status(500).send(error)
    })
*/
})

taskRouter.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id

    // ------------ UPDATED TO USE ASYNC AND AWAIT

    try{
        //Get All the tasks
        //var task = await Task.findById(_id)

        //Gets me the task user specific
        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
/*
    Task.findById(_id).then((task)=>{
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }).catch((error)=>{
        res.status(500).send()
    })
*/
})

taskRouter.get('/task/add', (req, res) => {
    try{
        res.sendFile(path.join(__dirname,'../html/deleteUser.html'))
    }catch(e){
        res.status(500).send(e)
    }
})

taskRouter.patch('/tasks/:id', auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'completed']
    var isValidOperation = updates.every((updates) => allowedUpdates.includes(updates))

    if(!isValidOperation){
        return res.status(400).send({"Error": "Invalid Updates"})
    }

    try{
        //const task = await Task.findOne({_id: req.params._id, owner: req.user._id})

        // Above will save few lines of code...

        const task = await Task.findById(req.params.id)
        
        if(!task){
            res.status(404).send()
        }
        
        if(task.owner.toString() !== req.user._id.toString()){
            res.status(401).send()    
        }
        
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.status(200).send(task)

    }catch(e){
        res.status(500).send(e)
    }
})

taskRouter.delete('/tasks/:id', auth, async (req,res)=>{
    try{
        var task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        //var task = await Task.findByIdAndDelete(req.params.id)

        if(!task){
            res.status(404).send()
        }

        res.status(200).send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = taskRouter