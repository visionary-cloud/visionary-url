import { ImageSizeEnum } from "./enum";

export const isDebugToken = (token: string) => token === "debug";

export const isImageSizeToken = (token: string): token is ImageSizeEnum =>
  Object.values(ImageSizeEnum).includes(token as ImageSizeEnum);

export const tokenizeOptionsString = (options: string) => options.split(",");
