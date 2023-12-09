import { describe, expect, test } from "vitest";

import { ImageSizeEnum } from "../enum";
import { parseOptionsString } from "../image-options";

describe(parseOptionsString.name, () => {
  test("can parse an options string with size and format specified", () => {
    const optionsString = "xs,f_auto";

    const parsedOptions = parseOptionsString(optionsString);

    expect(parsedOptions.size).toBe(ImageSizeEnum.xs);
  });

  test("can parse an options string with debug set", () => {
    const optionsString = "debug,xl";

    const parsedOptions = parseOptionsString(optionsString);

    expect(parsedOptions.debug).toBe(true);
    expect(parsedOptions.size).toBe(ImageSizeEnum.xl);
  });

  test("can parse an empty options string", () => {
    const parsedOptionsEmpty = parseOptionsString("");

    expect(Object.keys(parsedOptionsEmpty).length).toBe(0);
  });
});
