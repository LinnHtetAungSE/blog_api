const { itemNotFoundError } = require("../errors/db.error");

const success = (res, message, data) => {
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};

exports.ok = (res, message, data) => {
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};

exports.created = (res, message, data) => {
  return res.status(201).json({
    status: "created",
    message,
    data,
  });
};

exports.unauthorized = (res, message, data) => {
  return res.status(401).json({
    status: "forbidden",
    message,
    data,
  });
};

exports.error = (res, message, data) => {
  return res.status(500).json({
    status: "error",
    message,
    data,
  });
};

exports.retrieved = (res, name, data = null) => {
  if (!data) {
    throw itemNotFoundError(name);
  }
  return success(res, name, data);
};

exports.updated = (res, name, data = null) => {
  if (!data) {
    throw itemNotFoundError(name);
  }
  return success(res, name, data);
};

exports.deleted = (res, name, data = null) => {
  if (!data) {
    throw itemNotFoundError(name);
  }
  return success(res, name, data);
};

exports.paginatedData = (req, content, pageable) => {
  return req.query.page && req.query.size ? { content, pageable } : content;
};
