import { decode as decodeBase64Url, encode as encodeBase64Url } from "universal-base64url";

import { V_CODE_SEPARATOR } from "./constants";
import { isBase64UrlFormatted } from "./util";

import { VisionaryImageFields } from "../types/visionary.types";

/**
 * Generates a Visionary image code
 */
export const generateVisionaryCode = (fields: VisionaryImageFields): string => {
  const { altText, blurhash, bcc, fileId, sourceHeight, sourceWidth } = fields;
  // Note: This order must be maintained.
  const partsToJoin = [fileId, sourceWidth, sourceHeight, bcc, blurhash];
  if (altText && altText.length) {
    partsToJoin.push(altText);
  }
  const rawCode = partsToJoin.join(V_CODE_SEPARATOR);
  const code = encodeBase64Url(rawCode);
  return code;
};

export const parseVisionaryCode = (code: string): VisionaryImageFields | null => {
  if (typeof code !== "string") {
    return null;
  }
  const sanitizedCode = code.trim();
  if (!sanitizedCode.length || !isBase64UrlFormatted(sanitizedCode)) {
    return null;
  }
  const imageData = decodeBase64Url(sanitizedCode);
  if (!imageData) {
    return null;
  }
  const fields = imageData.split(V_CODE_SEPARATOR);
  if (fields.length < 3) {
    return null;
  }
  const [fileIdInput, widthInput, heightInput, bcc, blurhash, altText] = fields;
  const fileId = fileIdInput.trim();
  if (!fileId.length) {
    console.error("Cannot parse code, empty file id");
    return null;
  }
  const sourceWidth = Number(widthInput.trim());
  const sourceHeight = Number(heightInput.trim());
  if (isNaN(sourceWidth) || isNaN(sourceHeight) || !sourceWidth || !sourceHeight) {
    console.error("Cannot parse code, invalid dimensions: ", widthInput, heightInput);
    return null;
  }
  return {
    altText,
    blurhash,
    bcc,
    blurhashComponents: "4x4",
    fileId,
    sourceHeight,
    sourceWidth,
  };
};
