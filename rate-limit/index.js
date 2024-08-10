/*
Token Bucket Algorithm -> 
1. Initialise a completely filled bucket with tokens
2. Whenever a request is made one token will be removed from bucket.
3. If there are no token in the bucket, reject the request with 429 status code
4. Refill the bucket with specific amt oftokens after every specific amt of time.    
*/

class TokenBucket {
  constructor(capacity, refillTokenRate) {
    (this.tokens = capacity), (this.bucketCapacity = capacity);
    setInterval(() => this.addToken(refillTokenRate), 1000);
  }

  addToken(refillTokenRate) {
    const reFilledBucket = this.tokens + refillTokenRate;
    this.tokens =
      reFilledBucket > this.bucketCapacity
        ? this.bucketCapacity
        : reFilledBucket;
  }

  removeToken() {
    if (this.tokens > 0) {
      this.tokens--;
      // accept the request
    } else {
      // reject the request with status code 429
    }
  }
}

/*
Leaky Bucket Algorithm ->

1. Initialise a empty bucket.
2. Drain the bucket with specific amt of tokens after every specific period of time.
3. If the bucket is full then reject the request otherwise
4. whenever a request is made, one token will be added.

*/

class LeakyBucket {
  constructor(capacity, removedTokenRate) {
    this.bucketCapacity = capacity;
    this.tokens = 0;
    setInterval(() => this.removeToken(removedTokenRate), 1000);
  }

  addToken() {
    if (this.tokens >= this.bucketCapacity) {
      // reject the request
    } else {
      this.tokens++;
    }
  }

  removeToken(removedTokenRate) {
    if (this.tokens !== 0) {
      this.tokens = this.tokens - removedTokenRate;
    }
  }
}

/*

Fixed Window Counter Algorithm

1. Each time window has a counter.
2. Timeline is divided into fixed time windows.
3. When a request comes in, the counter for the current time window is incremented.
4. If the counter is greater than the rate limit, the request is rejected.
5. If the counter is less than the rate limit, the request is accepted.

Disadvantage -> Single burst of requests near the end of the time window can exceed the rate limit. 
For instance, assume that the counter is empty at 10:59, and 10 requests are received. These requests 
will be processed. At 11:00, another 10 requests arrive, which will also be accepted since the counter is empty. 
This scenario leads to the violation of the rate limit, and the 10 requests per hour limit is not upheld.

*/

class FixedWindow {
  constructor(capacity, windowsTime) {
    this.capacity = capacity;
    this.counter = 0;
    setInterval(() => (this.counter = 0), windowsTime);
  }

  increment() {
    if (this.counter >= this.capacity) {
      // reject the request
    } else {
      this.counter++;
    }
  }
}
