const path = require('path')

const express = require('express');
const app = express();
const hbs = require('hbs');
require('./db/mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const port = process.env.PORT || 3000

const viewDir = path.join(__dirname,'../templates/views'); // locating view directory used by handlebars (hbs) to locate its files to render
const partialsPath = path.join(__dirname,'../templates/partials'); // locating partial directory again used by handlebars again.

app.set('views',viewDir); //telling express, where to find views directory #Bridge
app.set('view engine','hbs'); // needed to set-up to let express know which engine are we using and also for hbs, all the content is supposed to go in views folder!
hbs.registerPartials(partialsPath); // register hbs partials

app.use(bodyParser.urlencoded({
    extended: true
})) // For understanding form data
app.use(cookieParser()) // To get Auth Token back from client.
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'./html/index.html'))
})

app.listen(port,()=>{
    console.log('Server listening at port ' + port)
})