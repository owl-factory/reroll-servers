const express = require(`express`);
const app = express();
const server = require(`http`).Server(app);
const io = require(`socket.io`)(server, 
  {
    cors: {
      origin: "*"
    }
  }
);
// const { PeerServer } = require(`peer`);

app.use(express.static(`public`));

app.get(`/`, (req, res) => {
  // console.log((io.sockets.server.engine.clients))
  console.log((io.engine.clients))
  // console.log(io.sockets.adapter.rooms.get("1234").size)
  res.status(200).json({ success: true })
});

app.get(`/:room`, (req, res) => {
  res.status(200).json({ success: true });
});

// Handles socket stuff
io.on(`connection`, socket => {
  // Listen event for joining a table
  socket.on(`join-table`, (tableID, userID) => {
    socket.join(tableID);

    // console.log(socket.adapter.rooms.get(tableID));

    // Informs other players of the newcomer. Informs newcomer of table size
    const playersPresent = socket.adapter.rooms.get(tableID).size;
    socket.to(tableID).broadcast.emit(`player-joined`, userID, playersPresent)
    socket.emit(`i-joined`, playersPresent);

    console.log(`User ${userID} has joined. ${playersPresent} players playing`)

    socket.on(`disconnect`, () => {
      const table = socket.adapter.rooms.get(tableID);
      let playersPresent = 0;
      if (table) { playersPresent = table.size; }
      socket.to(tableID).broadcast.emit(`player-disconnected`, userID, playersPresent);
      console.log(`User ${userID} has left. ${playersPresent} players remain`)
    });
  });

  // Informs all players in the table that the current user is ready to play
  socket.on(`ready`, (tableID, userID) => {
    socket.to(tableID).broadcast.emit(`player-ready`, userID);
  });

  // Tells the players who the new host is. 
  socket.on(`assume-host`, (tableID, userID) => {
    socket.to(tableID).broadcast.emit(`new-host`, userID);
  });
});

// peerServer = PeerServer({ port: 3002, path: `/peer` });
server.listen(3001)