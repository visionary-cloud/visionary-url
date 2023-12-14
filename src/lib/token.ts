import { ImageSizeEnum, ImageTokenEnum } from "./enum";

export const isDebugToken = (token: string) => token === ImageTokenEnum.DEBUG;

export const isDownloadToken = (token: string) => token === ImageTokenEnum.DOWNLOAD;

export const isImageSizeToken = (token: string): token is ImageSizeEnum =>
  Object.values(ImageSizeEnum).includes(token as ImageSizeEnum);

export const tokenizeOptionsString = (options: string) => options.split(",");
