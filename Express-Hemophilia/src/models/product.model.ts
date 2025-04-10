import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export interface ProductAttributes {
  id?: number;
  name: string;
  description: string; //商品描述
  price: number;
  stock: number; //库存
  image: string;
  category: string; //商品类别
  status: number;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public image!: string;
  public category!: string;
  public status!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1, // 1: 上架, 0: 下架
    },
  },
  {
    sequelize,
    tableName: "products",
  }
);

export default Product;
