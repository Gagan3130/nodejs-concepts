const net = require("net");

/* createServer method creates a secure TCP server.
This method accept a callback function that get called whenever a new client is connect to the server
The callback function receives a socket object as an argument.
This socket object represents the connection between the server and the specific client that just connected. 
Through this socket, you can send data to or receive data from that client.
*/
const server = net.createServer((socket) => {
  // handle incoming data from client
  socket.on("data", (data) => {
    console.log(JSON.parse(data),"data")
    // Simulate processing of the request (asynchronous operation)
    setTimeout(() => {
        socket.write(JSON.stringify({type:'getUsers', data:[]}));
    }, 1000);
  });

  // Handle client disconnection
  socket.on('end', () => {
    console.log('Client disconnected');
  });

  // Handle errors
  socket.on('error', (err) => {
    console.error(`Error: ${err}`);
  });
});

// Specify the port and host the server should listen on
const PORT = 9090;
const HOST = '127.0.0.1';

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});
