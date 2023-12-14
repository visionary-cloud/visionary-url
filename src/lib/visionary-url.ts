import { CDN_ENDPOINT } from "./constants";
import { generateOptionsString, parseOptionTokens } from "./image-options";
import { compact, isBase64UrlFormatted } from "./util";

import {
  GenerateVisionaryUrlOptions,
  VisionaryImage,
  VisionaryImageFields,
  VisionaryUrlParts,
} from "../types/visionary.types";
import { generateVisionaryCode, parseVisionaryCode } from "./visionary-code";

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
