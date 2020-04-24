import * as dotenv from "dotenv";

dotenv.config();
export const env = {
    APP_PORT: Number(process.env.APP_PORT || 2009),
    API_KEY: process.env.API_KEY,
    CHROME_DATA_PATH: process.env.CHROME_DATA_PATH,
    BUCKET_NAME: process.env.BUCKET_NAME
};