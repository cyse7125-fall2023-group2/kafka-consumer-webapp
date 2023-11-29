const { DataTypes } = require("sequelize");

const createHealthCheck = (sequelize) => {
  let httpCheck = sequelize.define(
    "health-check",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      status: {
        type: DataTypes.STRING
      },
      message: {
        type: DataTypes.STRING
      },
      server: {
        type: DataTypes.STRING
      },
      expires: {
        type: DataTypes.STRING
      },
      date: {
        type: DataTypes.STRING
      }
    },
    {
      updatedAt: "check_updated",
      createdAt: "check_created",
    }
  );

  return httpCheck;
};

module.exports = createHealthCheck;
