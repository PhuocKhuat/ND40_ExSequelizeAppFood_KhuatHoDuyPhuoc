import { Sequelize } from "sequelize";
import config from "../configs/config.js";

const sequelize = new Sequelize(config.database, config.user, config.pass, {
    host: config.host,
    port: config.port,
    dialect: config.dialect
})

try {
    sequelize.authenticate()
    console.log("Connected")
} catch (error) {
    console.log("🚀 ~ error:", error)
}

export default sequelize;