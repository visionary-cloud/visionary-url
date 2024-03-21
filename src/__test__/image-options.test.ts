import { describe, expect, test } from "vitest";

import { ImageFormatToken, ImageSizeToken } from "../enum";
import { generateOptionsString, parseOptionsString } from "../image-options";
import { ImageOptions } from "../types/visionary.types";

describe(parseOptionsString.name, () => {
  test("parses an options string with size and format specified", () => {
    const optionsString = "xs,f_auto";

    const parsedOptions = parseOptionsString(optionsString);

    expect(parsedOptions.size).toBe(ImageSizeToken.xs);
  });

  test("tests a size token (lg)", () => {
    const optionsString = "lg";

    const parsedOptions = parseOptionsString(optionsString);

    expect(parsedOptions.size).toBe(ImageSizeToken.lg);
  });

  test("parses an options string with debug set", () => {
    const optionsString = "debug,xl";

    const parsedOptions = parseOptionsString(optionsString);

    expect(parsedOptions.debug).toBe(true);
    expect(parsedOptions.size).toBe(ImageSizeToken.xl);
  });

  test("parses an options string with download set", () => {
    const optionsString = "4k,download";

    const parsedOptions = parseOptionsString(optionsString);

    expect(parsedOptions.download).toBe(true);
    expect(parsedOptions.size).toBe(ImageSizeToken["4k"]);
  });

  test("parses an options string with format set", () => {
    const optionsString = "avif,lg";

    const parsedOptions = parseOptionsString(optionsString);

    expect(parsedOptions.format).toBe("avif");
    expect(parsedOptions.size).toBe("lg");
  });

  test("can parse an empty options string", () => {
    const parsedOptionsEmpty = parseOptionsString("");

    expect(Object.keys(parsedOptionsEmpty).length).toBe(0);
  });
});

describe(generateOptionsString.name, () => {
  test("generates a sorted options string from options", () => {
    const optionsString1 = generateOptionsString({
      download: true,
      format: ImageFormatToken.WEBP,
      size: ImageSizeToken.sm,
    });

    expect(optionsString1).toBe("download,sm,webp");

    const optionsString2 = generateOptionsString({
      debug: true,
      format: ImageFormatToken.AVIF,
      size: ImageSizeToken["5k"],
    });

    expect(optionsString2).toBe("5k,avif,debug");
  });

  test("does not return options string for invalid options", () => {
    expect(generateOptionsString(null as unknown as ImageOptions)).toBeNull();
    expect(generateOptionsString("" as unknown as ImageOptions)).toBeNull();
    expect(generateOptionsString({ notAnOption: true } as unknown as ImageOptions)).toBeNull();
  });
});
