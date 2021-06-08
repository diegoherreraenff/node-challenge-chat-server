const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json())

app.use(cors());

let welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
  timeSet: new Date()
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
let messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get("/messages", (req, res) => {
  res.json(messages)
});

app.get("/messages/latest", (req, res) => {
  const latest = messages.slice(messages.length - 10)
  console.log(latest)

  res.json(latest)

})
app.get("/messages/:id", (req, res) => {
  let id = parseInt(req.params.id);
  const isNUmber = !isNaN(id);
  if (isNUmber && id >= 0) {
    id = parseInt(req.params.id);
    let msj = messages.find((i) => i.id === id);
    //if exist
    if (msj) {
      res.json(msj)
    } else {
      // if not exist
      res.status(400).send(`messages with id=${id} not exist`)
    }
  } else {
    res.status(400).send("id must be equal or larger than 0!")
  }


})
app.post("/messages", (req, res) => {
  if (req.body.text && req.body.from) {
    let newmessages = req.body
    newmessages.id = Math.max(...messages.map((m) => m.id)) + 1
    const msj = {
      timeStamp: new Date(),
      ...newmessages
    }
    messages.push(msj)
    console.log(messages)
    res.status(201).json(messages)

  } else {
    res.status(400).send("format not value")
  }


})

app.delete("/messages/:id", (req, res) => {
  id = parseInt(req.params.id)
  const msjindex = messages.findIndex((m) => m.id === id)
  if (msjindex !== -1) {
    messages.splice(msjindex, 1)
    res.send(messages).json(messages)
  } else {
    res.status(400)
  }
})

app.get("/search", (req, res) => {
  let search = req.query.text.toLowerCase()
  let wanted = messages.filter(mjs => mjs.text.includes(search))
  if (wanted.length) {
    res.send(wanted)
  } else {
    res.status(400).send(`${search} not exist`)
  }

});

app.put("/messages/:id", (req, res) => {
  if (req.body.timeSet || req.body.id) {
    res.sendStatus(400)
  }
    let id = parseInt(req.params.id)
  let messagesIdex = messages.findIndex((m) => m.id === id)
  if (messagesIdex !== -1) {
    const newMessages = {
      ...messages[messagesIdex],
      ...req.body
    }
    messages[messagesIdex] = newMessages
    res.sendStatus(200)

  } else {
    res.sendStatus(400)
  }

})



app.listen(3000, () => {
  console.log("Listening on port 3000")
});