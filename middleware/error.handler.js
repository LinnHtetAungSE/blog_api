exports.handler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(err);
  if (err.message.match(/(unique|duplicate)/gi)) {
    return res.status(409).json({
      status: "fail",
      message: err.message,
      data: null,
    });
  }

  switch (err.name) {
    case "INVALID_ID":
    case "INVALID":
      res.status(400).json({
        status: "fail",
        message: ("%s.invalid", err.message),
        data: null,
      });
      break;
    case "ITEM_NOT_FOUND":
      res.status(404).json({
        status: "fail",
        message: ("%s.not.found", err.message),
        data: null,
      });
      break;
    case "MISSING_FILE":
      res.status(404).json({
        status: "fail",
        message: ("%s.missing", err.message),
        data: null,
      });
      break;
    case "ITEM_ALREADY_EXITS":
      res.status(409).json({
        status: "fail",
        message: ("%s.already.exits", err.message),
        data: null,
      });
      break;
    case "UNPROCESSABLE":
      res.status(422).json({
        status: "fail",
        message: err.message,
        data: null,
      });
      break;
    case "UNSUPPORTED_MEDIA_TYPE":
      res.status(415).json({
        status: "fail",
        message: err.message,
        data: null,
      });
      break;
    case "FAIL_MOVING_FILES":
      res.status(400).json({
        status: "fail",
        message: "fail.moving.files",
        data: null,
      });
      break;
    case "UNAUTHORIZED":
      res.status(401).json({
        status: "fail",
        message: ("%s.unauthorized", err.message),
        data: null,
      });
      break;
    case "NOT_ACCEPTABLE":
      res.status(406).json({
        status: "fail",
        message: ("%s.not.acceptable", err.message),
        data: null,
      });
      break;
    case "MulterError":
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          res.status(413).json({
            status: "fail",
            message: "file.too.large",
            data: null,
          });
          break;
        case "LIMIT_FILE_COUNT":
          res.status(400).json({
            status: "fail",
            message: "too.many.files",
            data: null,
          });
          break;
        default:
          res.status(400).json({
            status: "fail",
            message: err.message,
            data: null,
          });
          break;
      }
    default:
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        data: null,
      });
      break;
  }
};
