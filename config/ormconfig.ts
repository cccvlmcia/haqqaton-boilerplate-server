import devConfig from "../config/ormconfig.dev.json";
import prodConfig from "../config/ormconfig.dev.json";
const isProd = process.env.NODE_ENV === "production";
export default isProd ? prodConfig : devConfig;
