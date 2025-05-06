import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export interface ProductAttributes {
  id?: number;
  drugName: string; // 药品名称
  ingredients: string; // 成份
  indications: string; // 适应症
  dosage: string; // 用法用量
  adverseReactions: string; // 不良反应
  contraindications: string; // 禁忌
  precautions: string; // 注意事项
  storage: string; // 贮藏
  specification: string; // 规格
  manufacturer: string; // 生产企业
  price: number; // 价格
  image: string; // 图片
  stock: number; // 库存
  category: string; // 分类
  status: number;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number;
  public drugName!: string;
  public ingredients!: string;
  public indications!: string;
  public dosage!: string;
  public adverseReactions!: string;
  public contraindications!: string;
  public precautions!: string;
  public storage!: string;
  public specification!: string;
  public manufacturer!: string;
  public price!: number;
  public image!: string;
  public stock!: number;
  public status!: number;
  public category!: string;

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
    drugName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    indications: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dosage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    adverseReactions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contraindications: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    precautions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    storage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    specification: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    manufacturer: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "products",
  }
);

export default Product;
