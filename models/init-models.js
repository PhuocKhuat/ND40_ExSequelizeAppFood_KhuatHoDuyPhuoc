var DataTypes = require("sequelize").DataTypes;
var _code = require("./code");
var _users = require("./users");
var _video = require("./video");
var _video_comment = require("./video_comment");
var _video_like = require("./video_like");
var _video_type = require("./video_type");

function initModels(sequelize) {
  var code = _code(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var video = _video(sequelize, DataTypes);
  var video_comment = _video_comment(sequelize, DataTypes);
  var video_like = _video_like(sequelize, DataTypes);
  var video_type = _video_type(sequelize, DataTypes);

  video.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(video, { as: "videos", foreignKey: "user_id"});
  video_comment.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(video_comment, { as: "video_comments", foreignKey: "user_id"});
  video_like.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(video_like, { as: "video_likes", foreignKey: "user_id"});
  video_comment.belongsTo(video, { as: "video", foreignKey: "video_id"});
  video.hasMany(video_comment, { as: "video_comments", foreignKey: "video_id"});
  video_like.belongsTo(video, { as: "video", foreignKey: "video_id"});
  video.hasMany(video_like, { as: "video_likes", foreignKey: "video_id"});
  video.belongsTo(video_type, { as: "type", foreignKey: "type_id"});
  video_type.hasMany(video, { as: "videos", foreignKey: "type_id"});

  return {
    code,
    users,
    video,
    video_comment,
    video_like,
    video_type,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
