import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./user.model";

export interface NewsAttributes {
  id?: number;
  title: string;
  content: string;
  coverImage?: string;
  link?: string;
  userId: number;
  views: number; // 新增浏览量字段
  likes: number; // 新增点赞量字段
  status: number; // 新增状态字段
  createdAt?: Date;
  updatedAt?: Date;
}

export class News extends Model<NewsAttributes> implements NewsAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public coverImage?: string;
  public link?: string;
  public userId!: number;
  public views!: number;
  public likes!: number;
  public status!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

News.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    coverImage: {
      type: DataTypes.STRING(255),
    },
    link: {
      type: DataTypes.STRING(255),
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1, // 1: 正常, 0: 删除
    },
  },
  {
    sequelize,
    tableName: "news",
    timestamps: true,
  }
);

// 关联用户模型
News.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  targetKey: "id",
});
export default News;
