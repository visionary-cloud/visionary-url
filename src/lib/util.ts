import { ImageFormatEnum } from "./enum";

const BASE_BLURHASH_DIMENSIONS = 4;
const regexBase64Url = /^[A-Za-z0-9_-]*$/;

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

export const isBase64UrlFormatted = (str = "") => regexBase64Url.test(str);

/**
 * This is purposely kept simple as sometimes cranking these values up results in a good image, other times not.
 * Defaults to 4x4 (or 4x3 for landscape images).
 */
export const suggestedBlurhashComponentDimensions = (width: number, height: number) => {
  const aspectRatio = width / height;
  let x = BASE_BLURHASH_DIMENSIONS,
    y = BASE_BLURHASH_DIMENSIONS;

  // landscape
  if (aspectRatio >= 1.6) {
    y = 3;
  }

  return [x, y];
};
