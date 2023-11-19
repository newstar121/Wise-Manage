module.exports = {
  ...require("./models/User"),
  ...require("./models/Product"),
  ...require("./models/Order"),
  ...require("./models/Rate"),
  ...require("./models/Electric"),
  ...require("./models/Charity"),
  ...require("./connect"),
};
