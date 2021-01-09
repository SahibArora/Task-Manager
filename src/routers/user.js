const express = require('express')
const userRouter = new express.Router()

const User = require('../models/user')
const auth = require('../middleware/auth')

const multer = require('multer')

userRouter.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

userRouter.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

userRouter.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

userRouter.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

userRouter.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

userRouter.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
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

userRouter.post('/users/me/avatar', auth, avatar.single('avatar'), async (req,res) => {
    // req.file.buffer, holds the binary data for profile picture 

    req.user.avatar = req.file.buffer
    await req.user.save()

    res.status(200).send('Avatar uploaded')
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

userRouter.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()

    res.status(200).send("Your Avatar is now deleted")
})

userRouter.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

userRouter.get('/users/:id/avatar', async (req, res) => {
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