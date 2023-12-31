import { ImageFormatEnum, ImageSizeEnum } from "./enum";
import { ImageOptions } from "../types/visionary.types";

/**
 * Default CDN base URL.
 * - Can be overridden in the `options` field of generateVisionaryUrl()
 */
export const CDN_ENDPOINT = "https://cdn.visionary.cloud";

/**
 * Charater used to separate Visionary code fields.
 * (This must be a value not used by blurhash/base83 — see here: https://github.com/woltapp/blurhash/blob/master/Algorithm.md#base-83)
 */
export const V_CODE_SEPARATOR = "!";

export const DEFAULT_OPTIONS: ImageOptions = {
  debug: false,
  format: ImageFormatEnum.AUTO,
  size: ImageSizeEnum.lg,
};

/**
 * Maps bootstrap-inspired size codes to pixels
 */
export const IMAGE_SIZES: Record<ImageSizeEnum, number> = {
  [ImageSizeEnum.xs]: 160,
  [ImageSizeEnum.sm]: 320,
  [ImageSizeEnum.md]: 640,
  [ImageSizeEnum.lg]: 1280,
  [ImageSizeEnum.xl]: 1920,
  [ImageSizeEnum.xxl]: 2560,
  [ImageSizeEnum["4k"]]: 3840,
  [ImageSizeEnum["5k"]]: 5120,
};
