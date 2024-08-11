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