const httpStatus = require('http-status');
const AppError = require('../utils/appError');

exports.deleteById = Model => {
  return async (docId) => {
    const doc = await Model.findByIdAndDelete(docId);

    if (!doc) {
      throw new AppError('No document found with that ID!', httpStatus.NOT_FOUND);
    }

    return doc;
  }
}

exports.createOne = Model => {
  return async (data) => {
    const doc = await Model.create(data);
    return doc;
  }
}

exports.updateOne = Model => {
  return async (docId, data) => {
    const updateDoc = await Model.findByIdAndUpdate(docId, data, { new: true, runValidators: true });

    if (!updateDoc) {
      throw new AppError('No document found to update!', httpStatus.NOT_FOUND);
    }
    
    return updateDoc;
  }
}
