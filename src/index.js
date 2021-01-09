const express = require('express');
const app = express();
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('/', (req,res)=>{
    res.send("<h1>Welcome to Task-Manager App</h1>")
})

app.listen(port,()=>{
    console.log('Server listening at port ' + port)
})