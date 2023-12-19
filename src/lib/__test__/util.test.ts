import { describe, expect, test } from "vitest";

import { ImageFormatEnum } from "../enum";
import { isImageSizeToken, tokenizeOptionsString } from "../token";
import {
  compact,
  suggestedBlurhashComponentDimensions,
  formatToContentType,
  isBase64UrlFormatted,
} from "../util";

describe("Visionary URL utils", () => {
  describe(isImageSizeToken.name, () => {
    test("returns true for size token", () => {
      const isSize = isImageSizeToken("lg");

      expect(isSize).toBe(true);
    });

    test("returns false for non-size", () => {
      const isSize = isImageSizeToken("zzz");

      expect(isSize).toBe(false);
    });
  });

  describe(formatToContentType.name, () => {
    test("returns proper content type", () => {
      const result = formatToContentType(ImageFormatEnum.JPEG);

      expect(result.contentType).toBe("image/jpeg");
    });

    test("throws on unknown format", () => {
      expect(() => {
        formatToContentType("haha" as ImageFormatEnum);
      }).toThrow(/unknown format/);
    });
  });

  describe(isBase64UrlFormatted.name, () => {
    test("returns true for valid base64url values", () => {
      expect(isBase64UrlFormatted("dmlzaW9uYXJ5")).toBe(true);

      expect(isBase64UrlFormatted("dGhpcyBpcyBhIHZhbGlkIGJhc2U2NHVybCB2YWx1ZSBzaXI")).toBe(true);
    });

    test("returns false for invalid base64url values", () => {
      expect(isBase64UrlFormatted("YmFzZQ==")).toBe(false);
      expect(isBase64UrlFormatted("invalid!")).toBe(false);
    });
  });

  describe(tokenizeOptionsString.name, () => {
    test("can tokenize an options string", () => {
      const optionsString = "debug,xl";

      const tokens = tokenizeOptionsString(optionsString);

      expect(tokens).toEqual(["debug", "xl"]);
    });
  });

  describe(compact.name, () => {
    test("can compact an array of strings", () => {
      const items = ["", "image", "xyzzz", null, false, 0, "image.jpg"];

      const compactedItems = compact(items);

      expect(compactedItems).toEqual(["image", "xyzzz", "image.jpg"]);
    });
  });

  describe(suggestedBlurhashComponentDimensions.name, () => {
    test("can compute x, y blurhash components from image dimensions", () => {
      // square
      expect(suggestedBlurhashComponentDimensions(400, 400)).toEqual([4, 4]);

      // portrait
      expect(suggestedBlurhashComponentDimensions(2400, 3200)).toEqual([4, 4]);

      // landscape (AR > 2)
      expect(suggestedBlurhashComponentDimensions(1280, 605)).toEqual([4, 3]);
    });
  });
});
