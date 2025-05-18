import { mapLanguageCode } from "../lib/lang-utils.js";

test("maps 'en' to 'en-IN'", () => {
  expect(mapLanguageCode("en")).toBe("en-IN");
});

test("returns unknown code unchanged", () => {
  expect(mapLanguageCode("fr")).toBe("fr");
}); 