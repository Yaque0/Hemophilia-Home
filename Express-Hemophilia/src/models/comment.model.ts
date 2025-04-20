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
  parentId: number | null;
}

// 修改 Comment 模型，增加 parentId 字段用于多级评论
class Comment extends Model<CommentAttributes> implements CommentAttributes {
  public id!: number;
  public postId!: number;
  public userId!: number;
  public content!: string;
  public status!: number;
  public parentId!: number | null; // 新增字段，用于存储父评论ID

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
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true, // 允许为空，表示顶级评论
      references: {
        model: Comment,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "comments",
  }
);

// 关联模型：一个评论属于一个帖子和一个用户，且评论可能有父评论
Comment.belongsTo(Post, { foreignKey: "postId" });
Comment.belongsTo(User, {
  foreignKey: "userId",
  as: "user", // 保持与post模型一致
});
Comment.belongsTo(Comment, { foreignKey: "parentId", as: "parent" }); // 多级评论的父级关联
Post.hasMany(Comment, { foreignKey: "postId" });
User.hasMany(Comment, {
  foreignKey: "userId",
  as: "comments",
});
Comment.hasMany(Comment, { foreignKey: "parentId", as: "replies" }); // 多级评论的子级关联
export default Comment;
