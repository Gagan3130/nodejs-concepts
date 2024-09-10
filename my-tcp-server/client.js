const net = require('net');

// Create a TCP client and connect to the server
const client = net.createConnection({ port: 9090 }, () => {
    console.log('Connected to TCP server');
    
    // Send a request to get users
    client.write(JSON.stringify({ type: 'getUsers' }));
  });
  
  client.on('data', (data) => {
    console.log('Received from server:', data.toString());
    client.end();
  });
  
  client.on('end', () => {
    console.log('Disconnected from server');
  });