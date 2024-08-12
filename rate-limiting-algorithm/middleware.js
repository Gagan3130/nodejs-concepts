
// User IP based rate limiting based on sliding window algorithm

class SlidingWindowRateLimiter {
    constructor(windowSizeInSeconds, MaxRequestLimit) {
      this.windowSizeInSeconds = windowSizeInSeconds;
      this.MaxRequestLimit = MaxRequestLimit;
      this.requestTimestamps = new Map() // can use redis for distributed system instead of map
    }
  
      isRateLimited(userIdentifier) {
      const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
      if(!this.requestTimestamps.has(userIdentifier)){
        this.requestTimestamps.set(userIdentifier, [])
      }
      let userRequests = this.requestTimestamps.get(userIdentifier);
      userRequests = userRequests.filter(
        (timestamps) => timestamps > currentTime - this.windowSizeInSeconds
      ); // find the current window and remove the old timestamps 
      this.requestTimestamps.set(userIdentifier, userRequests)
      if (userRequests >= this.MaxRequestLimit) {
        return true
        //reject the reuqest
      } else {
        userRequests.push(currentTime);
        this.requestTimestamps.set(userIdentifier, userRequests);
        return false
        // accept the request
      }
    }
     middleware(){
        return (req,res,next)=>{
            if(this.isRateLimited(req.ip)){
                //reject the request here
            }
             //otherwise accept the request and move to next middleware
             next()
        }
     }
  }



  // In server.js file


  const slidingWindowRateLimiter = new SlidingWindowRateLimiter(60,10)
  
  app.use(slidingWindowRateLimiter.middleware())