module.exports = {
  newInfoForUser: (newInfos, userId) => {
    return newInfos[userId] || newInfos["observer"];
  }
};
