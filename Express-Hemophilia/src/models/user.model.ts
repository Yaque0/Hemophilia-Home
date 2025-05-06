import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcryptjs";

export interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  username: string;
  avatar?: string;
  role: "user" | "admin";
  phone?: string;
  status: number;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public username!: string;
  public avatar!: string;
  public role!: "user" | "admin";
  public phone!: string;
  public status!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 密码比对方法
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

// 初始化用户表
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        isString(value: any) {
          if (typeof value !== "string") {
            throw new Error("密码必须是字符串类型");
          }
        },
      },
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "users",
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
      {
        fields: ["username"], // 显式定义普通索引
      },
    ],

    hooks: {
      beforeSave: async (user: User) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
