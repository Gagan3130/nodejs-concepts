const {parentPort} = require("worker_threads")

/*
The worker thread listens for messages from the main thread via parentPort.on('message').
It performs a CPU-intensive calculation (simulated here with a loop) and sends the result back to the main thread.
*/
parentPort.on("message", (task)=>{
    let result = 0;
    for(let i=0; i<task.iterations; i++){
        result = result + i
    }
    parentPort.postMessage(result)
})