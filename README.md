# Reroll Servers
This project contains the persistent servers that Reroll will need to operate. They are required for multiplayer features, which shall use these servers for connecting to other players for Peer to Peer multiplayer. These may be broken up into seperate repos eventually, but due to the small size of both they'll be sharing this one for the near future.

## Socket Server
Found in src/. This is a custom Express server that forms a socket between this server and the client, allowing for game updates to be sent to and recieved from the players of a specific table. 

## PeerJS Server
Found in peerjs/. This is a standard PeerJS server. It handles setting up the RTC connections between the clients, allowing for game data and eventually audio and video to be passed to the players through Peer to Peer connections.