export default function errorHandler(err, re, res, next) {
  console.dir(err)
  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
}
