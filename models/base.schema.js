const mongoose = require("mongoose");

exports.Schema = function (paths, ref, options) {
  let schema = new mongoose.Schema(
    {
      creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ref,
      },
      updater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ref,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

  if (paths) {
    schema.add(paths);
  }

  if (options) {
    for (let key in options) {
      schema.set(key, options[key]);
    }
  }

  schema.pre(/^(find(?!(ByIdAndUpdate|OneAndUpdate))|count)/, function (next) {
    if (!this._conditions.hasOwnProperty("statusMode")) {
      this.where({ isDeleted: false });
    }
    next();
  });

  return schema;
};
