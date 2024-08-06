/*
Event emitters can be used to track and display the progress of file uploads. 
The uploading component emits events at different stages (e.g., “upload started”, “progress update”, “upload complete”) 
with relevant information (e.g., percentage uploaded). 
A progress bar component subscribes to these events and updates its display accordingly, 
providing real-time feedback to the user.
Calling EventEmitter class construction from custom class
start Uploading is used to send the upload percentage to module which subscribed to ProgressBar class
*/

const events = require("events");
const fs = require("fs");

class ProgressBar extends events.EventEmitter {
  constructor(filePath, targetFilePath) {
    super();
    this.filePath = filePath;
    this.targetFilePath = targetFilePath;
    this.fileSize = fs.statSync(filePath).size;
    this.uploaded = 0;
  }
  startUploading() {
    this.emit("uploadStarted");
    const stream = fs.createReadStream(this.filePath, "utf-8");
    const writableStream = fs.createWriteStream(this.targetFilePath);
    stream.on("data", (chunk) => {
      this.uploaded += chunk.length;
      this.emit("progressUpdate", this.uploaded / this.fileSize);
    });
    stream.on("end", () => {
      this.emit("uploadComplete");
    });
    stream.pipe(writableStream);
  }
}

const progressBar = new ProgressBar(filePath, targetFilePath);
progressBar.on("progressUpdate", (copiedData) =>
  console.log(`${copiedData * 100}%`)
);
progressBar.on("uploadStarted", () => console.log("file upload started"));
progressBar.on("uploadComplete", () => console.log("file upload completed"));
progressBar.startUploading();

/*
Event emitters can simulate network events for testing purposes. By emitting events like connect, 
data, and error, developers can write test cases that exercise different network scenarios without 
relying on external services
*/

class MockSocket extends events.EventEmitter {
  constructor() {
    super();
  }

  connect() {
    this.emit("connect");
    setTimeout(() => {
      this.emit("data", { message: "Hello from server!" });
    }, 1000);
  }
}

const socket = new MockSocket();

socket.on("connect", () => {
  console.log("Socket connected");
});

socket.on("data", (data) => {
  console.log("Received data:", data);
});

socket.connect();
