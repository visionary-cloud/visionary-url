import { ImageFormatEnum } from "./enum";

export const compact = (items: any[]) => items.filter(Boolean);

export const formatToContentType = (format: ImageFormatEnum) => {
  switch (format) {
    case ImageFormatEnum.AVIF:
      return { contentType: "image/avif", extension: "avif" };
    case ImageFormatEnum.JPEG:
      return { contentType: "image/jpeg", extension: "jpg" };
    case ImageFormatEnum.WEBP:
      return { contentType: "image/webp", extension: "webp" };
    default:
      throw new Error(`formatToContentType: unknown format ${format}`);
  }
};

const base64UrlRegex = /^[A-Za-z0-9_-]*$/;

export const isBase64UrlFormatted = (str = "") => base64UrlRegex.test(str);
