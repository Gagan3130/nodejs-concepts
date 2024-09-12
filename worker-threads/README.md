# Why do we need worker threads at all?
A server can quickly become overwhelmed by a CPU-intensive workload. To illustrate, imagine you have two endpoints: one performs a simple, non-CPU intensive task, while the other handles a complex CPU-intensive operation that takes 10 seconds to complete. If your server is occupied with the CPU-intensive request, it won’t be able to promptly respond to the non-CPU-intensive request. This problem arises because we violate the golden rule of NodeJS: i.e. Don’t Block the Event Loop.

In NodeJS the I/O operations are handled separately and when they are finished, the event loop adds the callback associated with the I/O task in a microtask queue. When the call stack in the main thread is clear, the callback is pushed on the call stack and then it executes. To make this clear, the callback associated with the given I/O task does not execute in parallel; however, the task itself of reading a file or a network request happens in parallel with the help of the threads. Once the I/O task finishes, the callback runs in the main thread.

In Worker thread, we will offload a CPU-intensive task to another thread using the worker-threads module to avoid blocking the main thread. To do this, you will create a worker.js file that will contain the CPU-intensive task. In the parent.js file, you will use the worker-threads module to initialize the thread and start the task in the worker.js file to run in parallel to the main thread. Once the task completes, the worker thread will send a message containing the result back to the main thread.
We already know by now that when NodeJS process is launch, it gets launched with One process, One thread, One event loop, One V8 Engine Instance, One Node.js Instance. Just like main thread, each worker will have its own instance of V8, nod, libuv instance and Event Loop within the same process.
A V8 isolate refers to a separate entity within the chrome V8 runtime. It possesses its own JS heap and a microtask queue. This unique setup enables every Node.js worker to execute its JavaScript code in complete isolation from other workers

Each worker is connected to its parent worker via a message channel.


# Worker thread vs libuv thread pool

Both worker threads and the thread pool serve different purposes and are implemented differently. Worker threads are used for running JavaScript code in parallel, whereas the libuv thread pool is used for offloading I/O and certain CPU-bound tasks that are part of Node.js core modules.

## Worker Threads
 1. Used for CPU-bound tasks that would otherwise block the event loop, such as heavy computations, data processing, and parallel JavaScript execution.
 2. Each worker thread runs in its own JavaScript execution context (isolated from the main thread and other workers).
 3. You manually create and manage worker threads using the worker_threads module.
 4. Worker threads are meant for cases where you need parallelism in JavaScript code execution (e.g., offloading a CPU-intensive task to another thread).

## libuv thread pool
 1. Part of libuv, the underlying library that powers Node.js’s event loop and asynchronous I/O operations.
 2. Primarily used for I/O-bound tasks and certain CPU-bound tasks within native Node.js modules like:
       File system operations (fs.readFile, fs.writeFile).
       Cryptographic operations (crypto.pbkdf2, crypto.scrypt).
       DNS lookups (dns.lookup). 
       These are tasks that would block the event loop if they were executed on the main thread.
 3. The thread pool is automatically managed by Node.js, and by default, it consists of 4 threads (can be adjusted using the UV_THREADPOOL_SIZE environment variable).
 4. You don’t manually interact with the thread pool — it’s used internally by Node.js to offload expensive operations that would otherwise block the event loop.   
 5. Unlike the event loop which manages multiple operations concurrently relying on asynchronous callbacks to ensure non-blocking behavior, the thread pool allows parallel execution of tasks, as multiple threads can execute blocking tasks simultaneously.   
