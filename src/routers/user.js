const path = require('path')
const express = require('express')
const userRouter = new express.Router()

const User = require('../models/user')
const auth = require('../middleware/auth')

const multer = require('multer')

userRouter.get('/user/add',(req, res) => {
    try{
        res.render('addUser',{})
    }catch(e){
        res.status(500).send({error: 'Something went wrong!'})
    }
})

userRouter.post('/user', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie('token', token)
        res.render('welcomeUser', user)
    } catch (e) {
        res.status(500).send(e)
    }
})

userRouter.get('/user/login', (req,res) => {
    try{
        res.render('login',{})
    }catch(e){
        res.status(500).send(e)
    }
})

userRouter.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.cookie('token', token)
        res.render('welcomeUser', user)
    } catch (e) {
        res.status(400).send({Error: "Error"})
    }
})

userRouter.get('/user/logout', (req,res) => {
    try{
        res.sendFile(path.join(__dirname,'../html/logout.html'))
    }catch(e){
        res.status(500).send(e)
    }
})

userRouter.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.render('login',{})
    } catch (e) {
        res.status(500).send()
    }
})

userRouter.get('/user/logoutAll', (req,res)=>{
    try{
        res.sendFile(path.join(__dirname,'../html/logoutAll.html'))
    }catch(e){
        res.status(500).send(e)
    }
})

userRouter.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.render('login',{})
    } catch (e) {
        res.status(500).send()
    }
})

userRouter.get('/user/me', auth, async (req, res) => {
    res.render('welcomeUser',req.user)
})

userRouter.get('/user/update', auth, (req,res)=>{
    try{
        res.render('updateUser',req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

userRouter.patch('/user/update', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.body[update] == "" ? null :req.user[update] = req.body[update])
        await req.user.save()
        res.render('welcomeUser',{})
    } catch (e) {
        res.status(400).send(e)
    }
})

const avatar = multer({
    // if you comment dest, then buffer data will be passed to the next part of the function, else it will not.
    //dest: 'avatars',
    
    // Limit to check size of file
    limits: {
        fileSize: 1000000
    }, 
    fileFilter(req, file, cb) {
        
        if(!(file.originalname.endsWith('.jpg') || file.originalname.endsWith('.jpeg') || file.originalname.endsWith('.png'))){
            return cb(new Error('Only accepts .JPG or . JPEG or .png!'))
        }

        // Same thing above with REGEX

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Only accepts .jpg or .jpeg or .png!'))
        }

        cb(undefined, true)

        //cb(new Error('File must be a PDF!'))
        //cb(undefined, true) --- upload true
        //cb(undefined, false) --- upload false
    }
})

userRouter.get('/user/uploadAvatar', (req,res)=>{
    try{
        res.sendFile(path.join(__dirname,'../html/uploadAvatar.html'))
    }catch(e){
        res.status(500).send(e)
    }
})

userRouter.post('/user/me/avatar', auth, avatar.single('avatar'), async (req,res) => {
    // req.file.buffer, holds the binary data for profile picture 

    req.user.avatar = req.file.buffer
    await req.user.save()

    res.status(200).send('Avatar uploaded')
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

userRouter.get('/user/delete/Avatar', (req,res) => {
    try{
        res.sendFile(path.join(__dirname,'../html/deleteAvatar.html'))
    }catch(e){
        res.status(500).send(e)
    }
})

userRouter.delete('/user/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()

    res.status(200).send("Your Avatar is now deleted")
})

userRouter.get('/user/delete', (req,res)=>{
    try{
        res.sendFile(path.join(__dirname,'../html/deleteUser.html'))
    }catch(e){
        res.status(500).send(e)
    }
})

userRouter.delete('/user/delete', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.render('login',{})
    } catch (e) {
        res.status(500).send()
    }
})

userRouter.get('/user/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user.avatar){
            return res.status(404).send('No Avatar Found!')
        }

        res.set('Content-Type', 'image/jpg')
        res.status(200).send(user.avatar)
    }catch(e){
        res.status(500).send(new Error('Something went wrong'))
    }
})

module.exports = userRouter