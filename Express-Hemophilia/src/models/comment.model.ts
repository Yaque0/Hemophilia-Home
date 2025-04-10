import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./user.model";
import Post from "./post.model";

// 评论模型接口 创建评论
export interface CommentAttributes {
  id?: number;
  postId: number;
  userId: number;
  content: string;
  status: number;
}

class Comment extends Model<CommentAttributes> implements CommentAttributes {
  public id!: number;
  public postId!: number;
  public userId!: number;
  public content!: string;
  public status!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1, // 1: 正常, 0: 删除
    },
  },
  {
    sequelize,
    tableName: "comments",
  }
);

// 建立关联关系
Comment.belongsTo(Post, { foreignKey: "postId" });
Comment.belongsTo(User, { foreignKey: "userId" });
Post.hasMany(Comment, { foreignKey: "postId" });
User.hasMany(Comment, { foreignKey: "userId" });

export default Comment;
