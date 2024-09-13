const { Worker } = require("worker_threads");

/*
The WorkerPool class manages a pool of worker threads.
It tracks available (free) workers in the freeWorkers array.
It keeps a queue of pending tasks in the tasks array.
When a task is assigned to a worker, it sends the task data to the worker using worker.postMessage().
When a worker completes a task, the result is sent back to the main thread using worker.on('message'), and the worker is returned to the pool for reuse.
The executeTask() method is used to assign tasks to workers.
*/


class WorkerPool {
  constructor(total_workers, workerScript) {
    (this.total_workers = total_workers),
      (this.workerScript = workerScript),
      (this.freeWorkers = []),
      (this.tasks = []);

    for (let i = 0; i < this.total_workers; i++) {
      const worker = new Worker(this.workerScript);
      worker.on("message", (result) => {
        const { resolve } = worker.addedTask;
        console.log(result, "message results");
        resolve(result);
        this.freeWorkers.push(worker);
      });
      this.freeWorkers.push(worker);
    }
  }

  executeTask(task) {
    return new Promise((resolve, reject) => {
      this.tasks.push({ task, resolve, reject });
      if (this.freeWorkers.length > 0 && this.tasks.length > 0) {
        const worker = this.freeWorkers.pop();
        const { task, resolve, reject } = this.tasks.shift();
        worker.addedTask = { resolve, reject };
        worker.postMessage(task);
      }
    });
  }

  close(){
    for (const worker of this.freeWorkers){
        worker.terminate()
    }
  }
}

module.exports = WorkerPool;
