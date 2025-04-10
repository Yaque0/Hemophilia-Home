import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Order from "./order.model";
import Product from "./product.model";

// 定义订单商品模型
export interface OrderItemAttributes {
  id?: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

class OrderItem
  extends Model<OrderItemAttributes>
  implements OrderItemAttributes
{
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public quantity!: number;
  public price!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "order_items",
  }
);

// 建立关联关系
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });
Product.hasMany(OrderItem, { foreignKey: "productId" });

export default OrderItem;
