import { ImageFormatEnum, ImageSizeEnum } from "../lib/enum";

/**
 * Fields that are encoded in a Visionary URL
 */
export interface VisionaryImageFields {
  /**
   * Alt text
   */
  altText?: string;

  /**
   * Background color code
   */
  bcc: string;

  /**
   * Blurhash string
   */
  blurhash: string;

  /**
   * Visionary File ID or Image URL
   */
  fileId: string;

  /**
   * Height of original upload image (also max height)
   */
  sourceHeight: number;

  /**
   * Width of original upload image (also max width)
   */
  sourceWidth: number;
}

export interface GenerateVisionaryUrlOptions {
  /**
   * Specifies a custom endpoint
   */
  endpoint?: string;

  /**
   * Specifies a filename for the image URL. Defaults to `image.jpg`.
   * It's recommended to specify a filename as this improves discoverability of images by search engines.
   */
  filename?: string;
}

export interface VisionaryUrlParts {
  code: string;
  optionTokens: string[];
}

export interface VisionaryImage {
  fields: VisionaryImageFields;
  options: ImageOptions;
}

export interface ImageOptions {
  debug?: boolean;
  format?: ImageFormatEnum;
  size?: ImageSizeEnum;
}
