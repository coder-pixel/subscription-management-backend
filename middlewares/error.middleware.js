// ------------------------------------ IMPORTANT ------------------------------------
/* every express js middleware has this below structure: 
      
        const errorMiddleware = (err, req, res, next) => {};

    they have 2 additional set of data/fn's apart from req, res: -> err, next
      * err    -> it is the data that happends bedore the request / middleware call
      * next() -> the fn which woulf be called to move to the next middleware / request in the cycle

      eg: create subscription api call -> middleware (renewalDate) -> next() -> middleware (check for errors) -> next() -> controller
*/

const errorMiddleware = (err, req, res, next) => {
  try {
    // here will try to decipher the error, to know what type of error is this
    let error = { ...err };

    error.message = err.message;

    // just to know what's happening
    console.error({ error });

    // ----------------- handling common error types below => -----------------

    // Mongoose bad ObjectId error
    if (err.name === "CastError") {
      const message = "Resource not found";
      error = new Error(message);
      error.statusCode = 404;
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object?.values(err?.errors)?.map((val) => val?.message);
      error = new Error(message?.join(", "));
      error.statusCode = 400;
    }

    res
      ?.status(error?.statusCode || 500)
      ?.json({ success: false, error: error?.message || "Server Error" });
  } catch (error) {
    // passing to the next step, so that we know that error has actually happened
    next(error);
  }
};

export default errorMiddleware;
