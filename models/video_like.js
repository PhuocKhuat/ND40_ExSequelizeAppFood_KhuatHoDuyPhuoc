const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('video_like', {
    like_id: {
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
    dis_like: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'video_like',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "like_id" },
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
