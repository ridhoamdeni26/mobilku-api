module.exports = (sequelize, DataTypes) => {
  const Mobilku = sequelize.define(
    "Mobilku",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        isUnique: true,
        allowNull: false,
        autoIncrement: true,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lasteducation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "mobilkuapi",
      timestamps: true,
    }
  );

  return Mobilku;
};
