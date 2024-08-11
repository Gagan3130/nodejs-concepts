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