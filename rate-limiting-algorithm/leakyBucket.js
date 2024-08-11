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