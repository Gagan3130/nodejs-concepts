// User IP based rate limiting based on sliding window algorithm

// 1. Rejecting the over-limit request ->

class SlidingWindowRateLimiter {
  constructor(windowSizeInSeconds, MaxRequestLimit) {
    this.windowSizeInSeconds = windowSizeInSeconds;
    this.MaxRequestLimit = MaxRequestLimit;
    this.requestTimestamps = new Map(); // can use redis for distributed system instead of map
  }

  handleRequest(userIdentifier) {
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    if (!this.requestTimestamps.has(userIdentifier)) {
      this.requestTimestamps.set(userIdentifier, []);
    }
    let userRequests = this.requestTimestamps.get(userIdentifier);
    userRequests = userRequests.filter(
      (timestamps) => timestamps > currentTime - this.windowSizeInSeconds
    ); // find the current window and remove the old timestamps
    this.requestTimestamps.set(userIdentifier, userRequests);
    if (userRequests >= this.MaxRequestLimit) {
      return true;
      //reject the reuqest
    } else {
      userRequests.push(currentTime);
      this.requestTimestamps.set(userIdentifier, userRequests);
      return false;
      // accept the request
    }
  }
  middleware() {
    return (req, res, next) => {
      if (this.isRateLimited(req.ip)) {
        //reject the request here
      }
      //otherwise accept the request and move to next middleware
      next();
    };
  }
}

// 2. Throttling the over-limit request ->

class SlidingWindowRateLimiter {
  constructor(windowSizeInSeconds, MaxRequestLimit) {
    this.windowSizeInSeconds = windowSizeInSeconds;
    this.MaxRequestLimit = MaxRequestLimit;
    this.requestTimestamps = new Map(); // can use redis for distributed system instead of map
    this.queues = new Map();
  }

  processQueues(userIdentifier) {
    const userQueuesRequest = this.queues.get(userIdentifier);
    if (!userQueuesRequest || userQueuesRequest.length === 0) return;
    const queueRequest = userQueuesRequest.shift();
    if (queueRequest)
      this.handleRequest(queueRequest.req, queueRequest.res, queueRequest.next);
  }

  handleRequest(req, res, next) {
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    const userIdentifier = req.ip;
    if (!this.requestTimestamps.has(userIdentifier)) {
      this.requestTimestamps.set(userIdentifier, []);
    }
    let userRequests = this.requestTimestamps.get(userIdentifier);
    userRequests = userRequests.filter(
      (timestamps) => timestamps > currentTime - this.windowSizeInSeconds
    ); // find the current window and remove the old timestamps
    this.requestTimestamps.set(userIdentifier, userRequests);
    if (userRequests >= this.MaxRequestLimit) {
      if (!this.queues.has(userIdentifier)) {
        this.queues.set(userIdentifier, []);
      }
      this.queues.get(userIdentifier).push({ req, res, next });
      setTimeout(
        () => this.processQueues(userIdentifier),
        (this.windowSizeInSeconds / this.MaxRequestLimit) * 1000
      ); // delaying the request by processing in the queue
    } else {
      userRequests.push(currentTime);
      this.requestTimestamps.set(userIdentifier, userRequests);
      next();
      // accept the request
    }
  }
  middleware() {
    return (req, res, next) => {
      this.handleRequest(req, res, next);
    };
  }
}

// In server.js file

const slidingWindowRateLimiter = new SlidingWindowRateLimiter(60, 10);

app.use(slidingWindowRateLimiter.middleware());
