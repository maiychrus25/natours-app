class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // 1) Filtering
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['limit', 'page', 'sort', 'fields'];

    excludedFields.forEach((el) => {
      delete queryObj[el];
    });

    // Advanced filtering: gte, lte, gt, lt, etc
    let queryStr = JSON.stringify(queryObj);
    // eslint-disable-next-line arrow-body-style
    queryStr = queryStr.replace(/\b(lte|gte|lt|gt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // 2) Sorting
  sort() {
    if (this.queryString.sort) {
      // sort=price,-rating
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt _id'); // default sort
    }

    return this;
  }

  // 3) Field limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  // 4) Pagination
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
