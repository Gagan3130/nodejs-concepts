const WorkerPool = require("./pool");

/*
Key Concepts:
Task Distribution: When a new task is added, it is either assigned to an available worker or queued until a worker becomes free.
Reusing Workers: Workers are not terminated after completing a task; they are returned to the pool for reuse, improving performance by avoiding the overhead of creating new workers.
Parallel Processing: Multiple tasks can be processed in parallel, leveraging the power of multiple threads to handle CPU-bound operations without blocking the main thread or event loop.
*/

const pool = new WorkerPool(4, "./worker.js");

const runIntensiveTasks = async () => {
  const tasks = [
    { iterations: 1e7 },
    { iterations: 1e8 },
    { iterations: 1e9 },
    { iterations: 1e6 },
  ];
  const results = await Promise.all(
    tasks.map((task) => pool.executeTask(task))
  );
  console.log(results, "all results");
  pool.close();
};
runIntensiveTasks();
