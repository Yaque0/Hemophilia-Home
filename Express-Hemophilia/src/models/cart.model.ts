import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./user.model";
import Product from "./product.model";

// 定义购物车模型
export interface CartAttributes {
  id?: number;
  userId: number;
  productId: number;
  quantity: number;
}

class Cart extends Model<CartAttributes> implements CartAttributes {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  declare Product?: Product;
}

Cart.init(
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
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "carts",
  }
);

// 建立关联关系
Cart.belongsTo(User, { foreignKey: "userId" });
Cart.belongsTo(Product, { foreignKey: "productId", as: "Product" });
User.hasMany(Cart, { foreignKey: "userId" });
Product.hasMany(Cart, { foreignKey: "productId" });

export default Cart;
