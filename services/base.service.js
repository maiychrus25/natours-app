const httpStatus = require('http-status');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/APIFeatures');

exports.getAll = (Model) => {
  return async (queryString) => {
    // 1) Count total documents matching fitler 
    const filterObj = { ...queryString };
    const excludedFields = ['limit', 'page', 'sort', 'fields'];
    excludedFields.forEach((el) => delete filterObj[el]);
    
    let filterStr = JSON.stringify(filterObj);
    filterStr = filterStr.replace(/\b(lte|gte|lt|gt)\b/g, (match) => `$${match}`);
    
    const totalDocs = await Model.countDocuments(JSON.parse(filterStr));
    
    // 2) Apply features
    const features = new APIFeatures(
      Model.find(JSON.parse(filterStr)),
      queryString 
    );
    // const docs = await features.limitFields().sort().paginate().query.explain();
    const docs = await features.limitFields().sort().paginate().query;

    // 3) Pagination check
    const limit = queryString.limit * 1 || 5;
    const page = queryString.page * 1 || 1;

    const totalPages = Math.ceil(totalDocs / limit);
    if (page > totalPages && totalDocs > 0) {
      throw new AppError('This page does not exist!', httpStatus.NOT_FOUND);
    }

    return docs || [];
  }
}

exports.getOne = (Model, populateOptions) => {
  return async (docId) => {
    let query = await Model.findById(docId);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
      throw new AppError('No document found with that ID!', httpStatus.NOT_FOUND);
    }

    return doc;
  }
}

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
