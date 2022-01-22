import express from "express";
import http from "http";
import { initialize } from "./socket";

const app = express();
const server = new http.Server(app);

app.use(express.static(`public`));


app.get(`/`, (req, res) => {
  res.status(200).json({ success: true })
});

app.get(`/:room`, (req, res) => {
  res.status(200).json({ success: true });
});

// Handles socket stuff
initialize(server);

server.listen(3001);
