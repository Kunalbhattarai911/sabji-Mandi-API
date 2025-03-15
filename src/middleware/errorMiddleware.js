const errorMiddleware = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    Error: err.message,
  });
};

export default errorMiddleware