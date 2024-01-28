const getDaysFromCreatedAt = (createdAt) => {
  const givenDate = new Date(createdAt);
  const todayDate = new Date();
  const timeDifference = todayDate - givenDate;

  return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
};

module.exports = { getDaysFromCreatedAt };
