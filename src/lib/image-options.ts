import { ImageSizeEnum, ImageTokenEnum } from "../lib/enum";
import { isDebugToken, isDownloadToken, isImageSizeToken } from "../lib/token";
import { ImageOptions } from "../types/visionary.types";

export const parseOptionsString = (options = ""): ImageOptions => parseOptionTokens(options.split(","));

export const parseOptionTokens = (optionTokens: string[] = []): ImageOptions => {
  const returnOptions: ImageOptions = {};
  for (const token of optionTokens) {
    if (isImageSizeToken(token)) {
      returnOptions.size = ImageSizeEnum[token];
    } else if (isDebugToken(token)) {
      returnOptions.debug = true;
    } else if (isDownloadToken(token)) {
      returnOptions.download = true;
    }
  }
  return returnOptions;
};

export const generateOptionsString = (options: ImageOptions): string | null => {
  const tokenArr = [];
  if (options.debug) {
    tokenArr.push(ImageTokenEnum.DEBUG);
  }
  if (options.download) {
    tokenArr.push(ImageTokenEnum.DOWNLOAD);
  }
  if (options.size && isImageSizeToken(options.size)) {
    tokenArr.push(options.size);
  }
  return tokenArr.length ? tokenArr.sort().join(",") : null;
};
