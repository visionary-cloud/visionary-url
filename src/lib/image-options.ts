import { ImageSizeEnum } from "../lib/enum";
import { isDebugToken, isImageSizeToken } from "../lib/token";
import { ImageOptions } from "../types/visionary.types";

export const parseOptionTokens = (optionTokens: string[] = []): ImageOptions => {
  const returnOptions: ImageOptions = {};
  for (const token of optionTokens) {
    if (isImageSizeToken(token)) {
      returnOptions.size = ImageSizeEnum[token];
    } else if (isDebugToken(token)) {
      returnOptions.debug = true;
    }
  }
  return returnOptions;
};

export const parseOptionsString = (options = ""): ImageOptions => parseOptionTokens(options.split(","));
