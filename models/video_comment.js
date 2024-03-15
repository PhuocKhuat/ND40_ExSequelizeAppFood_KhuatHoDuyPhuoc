const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('video_comment', {
    comment_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    video_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'video',
        key: 'video_id'
      }
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reply_list: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'video_comment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "comment_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "video_id",
        using: "BTREE",
        fields: [
          { name: "video_id" },
        ]
      },
    ]
  });
};
