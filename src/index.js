const path = require('path')

const express = require('express');
const app = express();
require('./db/mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({
    extended: true
})) // For understanding form data
app.use(cookieParser()) // To get Auth Token back from client.
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
})

app.listen(port,()=>{
    console.log('Server listening at port ' + port)
})