const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, 'UTF-8'),
);

exports.deleteUser = (userId) => {
  const newUsers = users.filter((t) => t._id != tourId);

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(newUsers),
    (err) => {
      if (err) {
        return null;
      } else {
        return userId;
      }
    },
  );
};

exports.getAllUser = () => {
  return users;
};

exports.getUser = (userId) => {
  const user = users.find((t) => t._id === userId);
  if (!user) return null;
  return user;
};

exports.createUser = (data) => {
  const newId = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, data);

  users.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      if (err) {
        return null;
      } else {
        return newUser;
      }
    },
  );
};

exports.updateUser = (userId, data) => {
  const userIdx = users.findIndex((t) => t._id === userId);

  const user = users.find((t) => t.id === userId);
  const updateUser = Object.assign(user, data);

  users[userIdx] = updateUser;

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      if (err) {
        return null;
      } else {
        return updateUser;
      }
    },
  );
};
