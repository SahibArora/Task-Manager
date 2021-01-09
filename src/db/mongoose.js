const mongoose = require('mongoose')

mongoose.connect(('mongodb+srv://admin:admin1997@cluster0.vjfiu.mongodb.net/task-manager-api?retryWrites=true&w=majority'),{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})