import { decode as decodeBase64Url, encode as encodeBase64Url } from "universal-base64url";

import { CDN_ENDPOINT, V_CODE_SEPARATOR } from "./constants";
import { generateOptionsString, parseOptionTokens } from "./image-options";
import { compact, isBase64UrlFormatted } from "./util";

import {
  GenerateVisionaryUrlOptions,
  VisionaryImage,
  VisionaryImageFields,
  VisionaryUrlParts,
} from "../types/visionary.types";

/**
 * Given a Visionary URL, extracts the code and any options tokens
 */
const extractUrlParts = (inputUrl: string): VisionaryUrlParts | null => {
  const url = new URL(inputUrl);
  const pathParts = compact(url.pathname.split("/"));
  if (pathParts[0] !== "image" || ![3, 4].includes(pathParts.length)) {
    throw new Error("Unrecognized URL");
  }
  const code = pathParts[1].trim();
  if (!code.length || !isBase64UrlFormatted(code)) {
    throw new Error("URL is not formatted as base64url");
  }
  // Options defined in URL
  if (pathParts.length === 4) {
    const optionTokens = pathParts[2].split(",");
    return {
      code,
      optionTokens,
    };
  }
  // Options not defined in URL
  if (pathParts.length === 3) {
    return {
      code,
      optionTokens: [],
    };
  }
  throw new Error(`Unable to parse input URL: ${inputUrl}`);
};

export const parseVisionaryUrl = (url: string): VisionaryImage | null => {
  if (!url) {
    return null;
  }
  const sanitizedUrl = url.trim();
  if (!sanitizedUrl) {
    return null;
  }
  try {
    const parts = extractUrlParts(sanitizedUrl);
    if (!parts) {
      return null;
    }
    const { code, optionTokens } = parts;
    const fields = parseVisionaryCode(code);
    if (!fields) {
      return null;
    }
    const options = parseOptionTokens(optionTokens);
    return {
      fields,
      options,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error parsing URL: ${error.message}`, error);
    } else {
      console.error("uncaught error", error);
    }
  }
  return null;
};

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

export const generateVisionaryUrl = (
  fields: VisionaryImageFields,
  options?: GenerateVisionaryUrlOptions
): string => {
  const code = generateVisionaryCode(fields);
  const endpoint = options?.endpoint ? new URL(options.endpoint) : new URL(CDN_ENDPOINT);
  if (!endpoint.origin) {
    throw new Error("Cannot construct Visionary URL: bad endpoint");
  }
  const urlParts = [endpoint.origin, "image", code];
  const optionsString = options ? generateOptionsString(options) : null;
  if (optionsString) {
    urlParts.push(optionsString);
  }
  if (options?.filename) {
    urlParts.push(options.filename);
  } else {
    urlParts.push("image.jpg");
  }
  return urlParts.join("/");
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
    fileId,
    sourceHeight,
    sourceWidth,
  };
};
