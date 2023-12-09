import { describe, expect, test } from "vitest";

import { VisionaryImageFields } from "../../types/visionary.types";
import { ImageSizeEnum } from "../enum";
import {
  generateVisionaryCode,
  generateVisionaryUrl,
  parseVisionaryUrl,
  parseVisionaryCode,
} from "../visionary-url";

const sampleFields: VisionaryImageFields = {
  blurhash: "LCDJYN9FxG_M_N%L%M%M4o~ptRIA",
  bcc: "110044",
  fileId: "vb87s1",
  sourceHeight: 1200,
  sourceWidth: 1600,
};

const sampleUrl =
  "https://cdn.visionary.cloud/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/strawberries.jpg";

describe("visionary-url", () => {
  /**
   * parseVisionaryCode
   */
  describe(parseVisionaryCode.name, () => {
    test("can parse a Visionary code with a URL as fileId", () => {
      const code =
        "aHR0cDovL2kuaW1hZ2VjZG40Mi5zcGFjZS9wdWJsaWMvaW1hZ2UtMTEuanBnITcwITY5IUJBQ0NBRSFMS05dUnYlMlR3PXddflJCVlpSaX07UlB4dXdI";

      const fields = parseVisionaryCode(code);

      expect(fields?.sourceWidth).toBe(70);
      expect(fields?.bcc).toBe("BACCAE");
      expect(fields?.fileId).toBe("http://i.imagecdn42.space/public/image-11.jpg");
      expect(fields?.blurhash).toBe("LKN]Rv%2Tw=w]~RBVZRi};RPxuwH");
    });

    test("can ignore a bad code", () => {
      const badCode = "nawwww~son";

      const test = parseVisionaryCode(badCode);

      expect(test).toBeNull();
    });

    test("can ignore an empty code", () => {
      expect(parseVisionaryCode("")).toBeNull();
    });
  });

  /**
   * parseVisionaryUrl
   */

  describe(parseVisionaryUrl.name, () => {
    test("can parse a Visionary URL", () => {
      const { fields, options } = parseVisionaryUrl(sampleUrl)!;

      expect(fields.fileId).toBe("vb87s1");
      expect(Object.keys(options).length).toBe(0);
    });

    test("can parse a Visionary URL with options", () => {
      const urlWithOptions =
        "https://cdn.visionary.cloud/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/4k/strawberries.jpg";

      const { fields, options } = parseVisionaryUrl(urlWithOptions)!;

      expect(fields.fileId).toBe("vb87s1");
      expect(options.size).toBe(ImageSizeEnum["4k"]);
      expect(Object.keys(options).length).toBe(1);
    });

    test("can parse bad input", () => {
      const response = parseVisionaryUrl(null as unknown as string);

      expect(response).toBe(null);
    });
  });

  /**
   * generateVisionaryUrl
   */

  describe(generateVisionaryUrl.name, () => {
    test("can generate a Visionary URL", () => {
      const url = generateVisionaryUrl(sampleFields);

      const expectedUrl =
        "https://cdn.visionary.cloud/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/image.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("can generate a URL with a custom endpoint", () => {
      const url = generateVisionaryUrl(sampleFields, {
        endpoint: "https://cdn.iss.space",
      });

      const expectedUrl =
        "https://cdn.iss.space/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/image.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("can generate a URL with a custom filename", () => {
      const url = generateVisionaryUrl(sampleFields, {
        filename: "strawberry-fields-vibrant-red.jpg",
      });

      // TODO: expected URL should have different filename!!
      const expectedUrl =
        "https://cdn.visionary.cloud/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/image.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("throws on invalid endpoint", () => {
      const testError1 = () => {
        generateVisionaryUrl(sampleFields, {
          // Endpoint with no protocol specified
          endpoint: "adam.com",
        });
      };

      const testError2 = () => {
        generateVisionaryUrl(sampleFields, {
          endpoint: "not-a-url",
        });
      };

      expect(testError1).toThrowError(/Invalid URL/);
      expect(testError2).toThrowError(/Invalid URL/);
    });
  });

  /**
   * generateVisionaryCode
   */

  describe(generateVisionaryCode.name, () => {
    test("can generate a code", () => {
      const fields: VisionaryImageFields = {
        sourceHeight: 100,
        sourceWidth: 100,
        blurhash: "blurhashvalllue",
        bcc: "be3e3f",
        fileId: "jk92",
      };

      const code = generateVisionaryCode(fields);

      const expectedCode = "ams5MiExMDAhMTAwIWJlM2UzZiFibHVyaGFzaHZhbGxsdWU";
      expect(code).toBe(expectedCode);
    });

    test("can generate a code with alt text", () => {
      const fields: VisionaryImageFields = {
        altText: "Happy cow on a farm",
        blurhash: "blurhashvalllue",
        bcc: "be3e3f",
        fileId: "jk93",
        sourceHeight: 100,
        sourceWidth: 100,
      };

      const code = generateVisionaryCode(fields);

      const expectedCode = "ams5MyExMDAhMTAwIWJlM2UzZiFibHVyaGFzaHZhbGxsdWUhSGFwcHkgY293IG9uIGEgZmFybQ";
      expect(code).toBe(expectedCode);
    });
  });
});
