const { parentPort, workerData } = require('worker_threads');

/*
The first line loads the worker_threads module and extracts the parentPort class. 
The class provides methods you can use to send messages to the main thread. 
WorkerData contain the data passed from the main thread when the thread is initialized. 
Then you invoke the postMessage() method of the parentPort class, which sends a message to 
the main thread containing the result of the CPU-bound task stored i.e. square.

If you don't want to create new file for worker you can just pass __filename as worker instantiation script path and 
it’ll the same file. And with isMainThread you can segregate your logic which you would like to on main thread and worker thread. 
Instantiated object possesses a property as unique threadId.
*/

// Heavy computation function (e.g., calculating factorial)
function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

// Perform the heavy task in the worker thread
const result = factorial(workerData.number);

// Send the result back to the main thread
parentPort.postMessage(result);