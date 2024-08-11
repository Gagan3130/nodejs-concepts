/*

Sliding Window Counter Algorithm ->

We have a window of size N minutes (in our case N=1). In first 10 seconds there are 5 requests. [0:00–0:10]. In time [01:15] there are another 10 requests.
The maximum number of requests is calculated by following formula:

Requests in current window + Requests in previous window * Overlap percentage of roling and previous window

Algorithm ->


1. When a request is made, we remove timestamps that are outside the current sliding window (older than the window size)
2. We check if the length of the updated timestamp array exceeds the allowed maximum requests.
3. If the user has exceeded the allowed number of requests, we reject it
4. Otherwise, the request is allowed to proceed.

*/

class SlidingWindowRateLimiter {
    constructor(windowSizeInSeconds, MaxRequestLimit) {
      this.windowSizeInSeconds = windowSizeInSeconds;
      this.MaxRequestLimit = MaxRequestLimit;
      this.requestTimestamps = [];
    }
  
    isRateLimited() {
      const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
      const currentWindowTimestamps = this.requestTimestamps.filter(
        (timestamps) => timestamps > currentTime - this.windowSizeInSeconds
      ); // find the current window and remove the old timestamps 
      this.requestTimestamps = currentWindowTimestamps;
      if (this.requestTimestamps.length >= this.MaxRequestLimit) {
        //reject the reuqest
      } else {
        this.requestTimestamps.push(currentTime);
        // accept the request
      }
    }
  }