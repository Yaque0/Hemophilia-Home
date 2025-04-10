import { Model, DataTypes } from "sequelize";

import sequelize from "../config/database";

export interface CarouselAttributes {
  id?: number;
  image: string; //轮播图
  link: string; //链接
  status: number; //状态 1显示 0隐藏
  sorOrder: number; //排序
  title: string; //标题
}

class Carousel extends Model<CarouselAttributes> implements CarouselAttributes {
  public id!: number;
  public image!: string;
  public link!: string;
  public status!: number;
  public sorOrder!: number;
  public title!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Carousel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, //自增
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false, //不允许为空
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT, //1字节
      defaultValue: 1, // 1: 上架, 0: 下架
    },
    sorOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "carousel",
  }
);

export default Carousel;
