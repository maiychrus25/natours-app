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
