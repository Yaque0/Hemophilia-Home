import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./user.model";

// 定义订单模型
export interface OrderAttributes {
  id?: number;
  userId: number;
  totalAmount: number;
  status: string;
  address: string;
  phone: string;
  remark?: string;
}

class Order extends Model<OrderAttributes> implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public totalAmount!: number;
  public status!: string;
  public address!: string;
  public phone!: string;
  public remark!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
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
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "shipped",
        "completed",
        "cancelled"
      ),
      defaultValue: "pending",
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    remark: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "orders",
  }
);

// 建立与用户的关联
Order.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Order, { foreignKey: "userId" });

export default Order;
