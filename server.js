const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

//goal is to get the thumbs up and thumbs down feature working with one number

//Also, sort through the messages by the most liked, if we are able.

const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true"; //connects to MongoDB server
const dbName = "demo";

app.listen(3000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('messages').find().sort({ thumbUp: -1 }).toArray((err, result) => {//goes to db (our datbase), goes into the collection 'messages', finds all the documents in the messages collections, plugs those documents/objects into an array with toArray. 
    if (err) return console.log(err)
    res.render('index.ejs', { messages: result })//renders the result from the messages collection through ejs so that ejs can spit it out as html. "render our ejs using this data from messages"
  })
})

app.post('/messages', (req, res) => {
  console.log(req.body)
  db.collection('messages').insertOne({ name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 }, (err, result) => {//insertOne is inserting the object with the fields that we select from the req.body, which was the info submitted by the user. req.body field names come from ths name attributes of the inputs inside the form element in our index.ejs.
    if (err) return console.log(err)
    console.log('saved to database')
    console.log(result)
    res.redirect('/') //redirects back to main page and uses the app.get request
  })
})


app.put('/messages', (req, res) => {
  const upOrDown = req.body.hasOwnProperty('thumbDown') ? 'thumbDown' : 'thumbUp'
  db.collection('messages')
    .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
      $inc: { //$sets something from the database and the code below allows us to SET the thumbs up to its value plus one. but I used increment here ($inc) instead. 
        [upOrDown]: 1,
      },
    }, {
      sort: { _id: -1 },//sorting bottom to top 
      upsert: true
    },
      (err, result) => {
        if (err) return res.send(err)
        console.log(result)
        res.send(result)
      })
})


app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
