export const sendError = (res, status, error) => {
  res.status(status).json({
    status: "Failed",
    message: error
  })
}