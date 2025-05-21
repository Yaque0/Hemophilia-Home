import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./user.model";

class Video extends Model {
  public id!: number;
  public title!: string;
  public cover!: string;
  public url!: string;
  public description!: string;
  public userId!: number;
  public status!: number; // 0-未发布 1-已发布
}

Video.init(
  {
    title: { type: DataTypes.STRING(200), allowNull: false },
    cover: { type: DataTypes.STRING(500), allowNull: false },
    url: { type: DataTypes.STRING(500), allowNull: false },
    description: DataTypes.TEXT,
    userId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    sequelize,
    tableName: "videos",
    timestamps: true,
    underscored: true,
  }
);

// 关联用户模型
Video.belongsTo(User, { foreignKey: "userId" });

export default Video;
