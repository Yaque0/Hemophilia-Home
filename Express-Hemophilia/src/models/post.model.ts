import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./user.model";

// 帖子模型接口 创建帖子
export interface PostAttributes {
  id?: number;
  userId: number;
  title: string;
  content: string;
  category: string;
  views: number;
  likes: number;
  status: number;
}

class Post extends Model<PostAttributes> implements PostAttributes {
  public id!: number;
  public userId!: number;
  public title!: string;
  public content!: string;
  public category!: string;
  public views!: number;
  public likes!: number;
  public status!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
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
    tableName: "posts",
  }
);

// 建立与用户的关联
Post.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
});

export default Post;
