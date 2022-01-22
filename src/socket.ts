import http from "http";
import { Server, Socket } from "socket.io";

/**
 * Initializes the Socket server
 * @param server The HTTP server
 */
export function initialize(server: http.Server) {
  const io = new Server(server, 
    {
      cors: {
        origin: "*"
      }
    }
  );

  io.on(`connection`, (socket: any) => {
    // Listen event for joining a table
    socket.on(`join-table`, (tableID: string, userID: string) => {
      onJoinTable(socket, tableID, userID);
      socket.on(`disconnect`, () => { onLeaveTable(socket, tableID, userID); });
    });

    // Informs all players in the table that the current user is ready to play
    socket.on(`ready`, (tableID: string, userID: string) => {
      socket.to(tableID).broadcast.emit(`player-ready`, userID);
    });

    // Tells the players who the new host is. 
    socket.on(`assume-host`, (tableID: string, userID: string) => {
      socket.to(tableID).broadcast.emit(`new-host`, userID);
    });
  });
}

/**
 * Runs all actions that should fire when joining a new table
 * @param socket The Socket connection 
 * @param tableID The table being joined
 * @param userID The ID of the user joining the table
 */
function onJoinTable(socket: any, tableID: string, userID: string) {
  socket.join(tableID);

  // Informs other players of the newcomer. Informs newcomer of table size
  const playersPresent = socket.adapter.rooms.get(tableID).size;
  socket.to(tableID).broadcast.emit(`player-joined`, userID, playersPresent)
  socket.emit(`i-joined`, playersPresent);

  // TODO - replace with proper logging at some point
  console.log(`User ${userID} has joined. ${playersPresent} players playing`);
}

/**
 * Actions to run when a user leaves the table
 * @param socket The socket connection
 * @param tableID The ID of the table being left
 * @param userID The ID of the user leaving the table
 */
function onLeaveTable(socket: any, tableID: string, userID: string) {
  const table = socket.adapter.rooms.get(tableID);

  let playersPresent = 0;
  if (table) { playersPresent = table.size; }

  socket.to(tableID).broadcast.emit(`player-disconnected`, userID, playersPresent);
  // TODO - replace with proper logging at some point
  console.log(`User ${userID} has left. ${playersPresent} players remain`)
}