import { describe, expect, test } from "vitest";
import { parseVisionaryCode, generateVisionaryCode } from "../visionary-code";
import { VisionaryImageFields } from "../../types/visionary.types";

describe("visionary-code", () => {
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
   * generateVisionaryCode
   */

  describe(generateVisionaryCode.name, () => {
    test("can generate a code", () => {
      const fields: VisionaryImageFields = {
        bcc: "be3e3f",
        blurhash: "blurhashvalllue",
        blurhashComponents: "4x4",
        fileId: "jk92",
        sourceHeight: 100,
        sourceWidth: 100,
      };

      const code = generateVisionaryCode(fields);

      const expectedCode = "ams5MiExMDAhMTAwIWJlM2UzZiFibHVyaGFzaHZhbGxsdWU";

      expect(code).toBe(expectedCode);
    });

    test("can generate a code with alt text", () => {
      const fields: VisionaryImageFields = {
        altText: "Happy cow on a farm",
        blurhash: "blurhashvalllue",
        blurhashComponents: "4x4",
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
