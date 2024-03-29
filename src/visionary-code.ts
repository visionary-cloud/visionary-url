import { decode as decodeBase64Url, encode as encodeBase64Url } from "universal-base64url";

import { V_CODE_SEPARATOR } from "./constants";
import { isBase64UrlFormatted } from "./util";

import { VisionaryImageFields } from "./types/visionary.types";

/**
 * Generates a Visionary image code
 */
export const generateVisionaryCode = (fields: VisionaryImageFields): string | Error => {
  const { altText, bcc, blurhash, blurhashX, blurhashY, fileId, sourceHeight, sourceWidth } = fields;
  if (!fileId || !sourceWidth || !sourceHeight) {
    return new Error("Cannot construct visionary code: missing required fileId/width/height");
  }
  // minimum needed image placeholder information
  const visionaryComponents = [fileId, sourceWidth, sourceHeight];
  if (!bcc) {
    return joinAndEncodeComponents(visionaryComponents);
  }
  // background color code is specified
  visionaryComponents.push(bcc);
  if (!blurhash || !blurhashX || !blurhashY) {
    return joinAndEncodeComponents(visionaryComponents);
  }
  // blurhash data is specified
  visionaryComponents.push(blurhash, blurhashX, blurhashY);
  // alt text is specified
  if (altText && altText.length) {
    visionaryComponents.push(altText);
  }
  return joinAndEncodeComponents(visionaryComponents);
};

const joinAndEncodeComponents = (components: Array<string | number>): string =>
  encodeBase64Url(components.join(V_CODE_SEPARATOR));

export const parseVisionaryCode = (code: string): VisionaryImageFields | null => {
  if (typeof code !== "string") {
    return null;
  }
  const sanitizedCode = code.trim();
  if (!sanitizedCode.length || !isBase64UrlFormatted(sanitizedCode)) {
    return null;
  }
  const imageDataStr = decodeBase64Url(sanitizedCode);
  if (!imageDataStr) {
    return null;
  }
  // const fields = imageData.split(V_CODE_SEPARATOR);
  const imageData = imageDataStr.split(V_CODE_SEPARATOR);
  // codes must contain at a minimum: fileId, width, height
  if (imageData.length < 3) {
    return null;
  }
  const [fileIdInput, widthInput, heightInput, bcc, blurhash, bhX, bhY, altText] = imageData;
  const fileId = fileIdInput.trim();
  if (!fileId.length) {
    console.error("Cannot parse code, empty file id");
    return null;
  }
  const sourceWidth = Number(widthInput.trim());
  const sourceHeight = Number(heightInput.trim());
  if (isNaN(sourceWidth) || isNaN(sourceHeight) || !sourceWidth || !sourceHeight) {
    console.error("Cannot parse code, invalid image dimensions: ", widthInput, heightInput);
    return null;
  }
  const blurhashX = Number(bhX) ?? 0;
  const blurhashY = Number(bhY) ?? 0;
  if (blurhashX < 1 || blurhashY < 1) {
    console.error("Cannot parse code, invalid blurhash x, y component dimensions");
    return null;
  }
  const fields: VisionaryImageFields = {
    altText,
    bcc,
    blurhash,
    blurhashX,
    blurhashY,
    fileId,
    sourceHeight,
    sourceWidth,
  };
  return fields;
};
