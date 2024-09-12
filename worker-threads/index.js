const { Worker } = require('worker_threads');

// Function to create a worker and run a task in a separate thread

/*First, you import the worker_threads module and unpack the Worker class. 
You create an instance of the Worker using the new keyword that is followed by a call to Worker with the worker.js file path as its argument. 
This creates a new thread and the code in the worker.js file starts running in the thread on another core.
Following this, you attach an event to the worker instance using the on("message") method to listen to the message event. 
When the message is received containing the result from the worker.js file, it is passed as a parameter to the method’s callback, which returns a response to the user containing the result of the CPU-bound task.
*/

function runWorker() {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./worker.js', { workerData: { number: 5 } });
  
      worker.on('message', (result) => resolve(result));  // Listen for messages from the worker
      worker.on('error', reject);     // Handle any error in the worker
      worker.on('exit', (code) => {
        if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  }

  runWorker().then(result => {
    console.log('Result from worker:', result);
  }).catch(err => {
    console.error(err);
  });
  console.log("hello worker thread")