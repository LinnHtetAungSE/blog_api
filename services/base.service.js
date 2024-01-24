const mongoose = require("mongoose");
const { invalidIdError, unauthorizedError } = require("../errors/db.error");
const { RES_DATE_AGG_FORMAT } = require("../constants/constants");

exports.checkId = async (id, Model, key) => {
  await this.checkValidObjectId(id, key);
  const document = await Model.findById(id);
  if (!document) {
    throw invalidIdError(key);
  }
};

exports.checkValidObjectId = async (id, key) => {
  if (!mongoose.isValidObjectId(id)) {
    throw invalidIdError(key);
  }
};

exports.getObjectId = async (id, key) => {
  await this.checkValidObjectId(id, key);
  if (id) {
    return new mongoose.Types.ObjectId(id);
  }
};

exports.getDateFormatStage = (dateFields) => {
  const stage = { $addFields: {} };
  dateFields.forEach((d) => {
    stage["$addFields"][d] = {
      $dateToString: { format: RES_DATE_AGG_FORMAT, date: `$${d}` },
    };
  });
  return stage;
};

exports.projectionPipeline = [
  { $addFields: { id: "$_id" } },
  {
    $project: {
      _id: 0,
      __v: 0,
      isDeleted: 0,
      creator: 0,
      updater: 0,
      createdAt: 0,
      updatedAt: 0,
      fileStoragePath: 0,
    },
  },
];

exports.filterById = (pipelineStages, obj) => {
  const filters = _.pickBy(obj, (v) => v !== undefined);

  for (key in filters) {
    pipelineStages.push({ $match: { [key]: filters[key] } });
  }
};

exports.addConditionToCriteria = (criteria, key, value) => {
  if (value) {
    return { ...criteria, [key]: value };
  }
  return criteria;
};

exports.getPaginatedItems = async (
  Model,
  skip = 1,
  limit = 6,
  sortBy = "createdAt",
  order = "-1",
  populate,
  criteria
) => {
  let query = {};
  if (criteria) {
    query = {
      $and: [criteria],
    };
  }

  const items = {
    content: await Model.find(query)
      .sort({ [sortBy]: parseInt(order) })
      .skip((parseInt(skip) - 1) * parseInt(limit))
      .limit(limit)
      .populate(populate),
    totalCount: await Model.countDocuments(query),
  };
  return items;
};
