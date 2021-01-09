// CRUD - create read update delete

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

// Or const {MongoClient, ObjectID} = mongodb;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";
/*const id = new ObjectID();

console.log(id);
console.log(id.getTimestamp());*/

MongoClient.connect(connectionURL,{ useNewUrlParser: true }, (error, client)=>{
    if (error){
        return console.log("Error: " + error);
    }
    const db = client.db(databaseName);

// --------------------- DeleteOne / DeleteMany ---------------------------------------

/*
    db.collection('users').deleteMany({
        name: "Sahib Arora"
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })


    db.collection('tasks').deleteOne({
        name: 'Do Something 3'
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
*/
// --------------------- UpdateOne / UpdateMany ---------------------------------------

/*
    const updatePromise = db.collection('users').updateOne({
        _id: new ObjectID('5fc150c22be6842ca8c6eb80')
    },{
        $inc: {
            age: 4
        }
    });

    updatePromise.then((result)=>{
        console.log(result);
    }).catch((error)=>{
        console.log(error);
    });

    db.collection('tasks').updateMany({
        done: false
    },{
        $set: {
            done: true
        }
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
*/
//   -------------------  FINDONE / FIND with ToArray((error,result)=>{}}) and count((error,count)=>{}) -------------- 


    /*db.collection('users').findOne({name: 'Sahib Arora'},(error, user)=>{
        if(error){
            return console.log("Error: " + error)
        }
        console.log(user);
    })

    db.collection('users').find({name:'Sahib Arora'}).toArray((error, users)=>{
        console.log(users);
    });

    db.collection('tasks').find({done: false}).count((error,count)=>{
        console.log(count);
    });

    db.collection('tasks').find({done: false}).toArray((error, users)=>{
        console.log(users);
    });

//  ------------------  InsertOne / InsertMany -------------------


/*db.collection('users').insertOne({
    _id: id,
    name: 'Sahib Arora',
    age: 23
},(error,client)=>{
    if(error){
        console.log(error)
    }
    console.log(client.ops);
});*/

    /*db.collection('users').insertOne({
        name:'Sahib Arora',
        age: 22
    },(error,result)=>{
        if(error){
            return console.log("Erorr: "+error);
        }

        console.log(result.ops);
        console.log(result.insertedCount);
    });

    db.collection('users').insertMany([{name: "abc",age:23},{name:"def",age:24}],(error,result)=>{
        if(error){
            return console.log("Error: " + error)
        }

        console.log(result.ops + " ," + result.insertedCount);
    });*/

   /* db.collection('tasks').insertMany([{name: 'Do Something 1', done: false},{name: 'Do Something 2', done: false}],(error,result)=>{
        if(error){
            return console.log("Error: " + error);
        }
        console.log(result.ops+", "+result.insertedCount);
    });*/

    /*db.collection('tasks').insertOne({name: 'Do Something 3', done: false},(error,result)=>{
        if(error){
            return console.log("Error: " + error);
        }
        console.log(result.ops+", "+result.insertedCount);
    });*/

    db.collection('users').deleteOne({
        name: 'admin',
        age: null
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })

});