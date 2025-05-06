import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function deleteIndexes() {
  try {
    const [results] = await sequelize.query("SHOW INDEX FROM users");

    // 过滤需要删除的索引（保留 PRIMARY 和 email）
    const indexesToDelete = results
      .filter(
        (row: any) => row.Key_name !== "PRIMARY" && row.Key_name !== "email"
      )
      .map((row: any) => row.Key_name);

    // 批量删除索引
    for (const indexName of indexesToDelete) {
      await sequelize.query(`ALTER TABLE users DROP INDEX ${indexName}`);
      console.log(`已删除索引: ${indexName}`);
    }

    console.log("索引删除完成");
  } catch (error) {
    console.error("删除索引失败:", error);
  } finally {
    await sequelize.close();
  }
}

deleteIndexes();
