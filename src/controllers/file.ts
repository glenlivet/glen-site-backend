import fs from "fs";
import { Request, Response } from "express";
import logger from "../util/logger";

import { FILE_DIR } from "../util/secrets";


export const getFileList = async (
  _1: Request,
  res: Response,
) => {
  const files = await fs.promises.readdir(FILE_DIR);
  logger.debug(files);
  res.json(files);
};

export const downloadFile = async (
  req: Request,
  res: Response,
) => {
  const fileName = req.params.name;
  res.sendFile(`${FILE_DIR}/${fileName}`);
};
