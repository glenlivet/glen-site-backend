import fs from "fs";
import { FILE_DIR } from "../util/secrets"
import logger from "../util/logger"

export const getFileList = async () => {
    const files = await fs.promises.readdir(FILE_DIR);
    logger.debug(files);
    for (const file of files) {
      logger.debug(file);
    }
}

getFileList().catch(logger.error)
