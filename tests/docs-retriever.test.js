import { apiTool } from "../tools/sarvam-api/sarvam-docs-file-retriever.js";
import { mkdtempSync, writeFileSync, rmdirSync } from "fs";
import { tmpdir } from "os";
import path from "path";

const get_sarvam_documentation_file = async (args, context) => {
  // The tool itself is in apiTool.function
  // We need to ensure process.env.SARVAM_API_KEY is set from context for the tool execution, if needed
  // However, this specific tool does not use SARVAM_API_KEY based on previous check.
  return await apiTool.function(args, context);
};

test("blocks directory traversal in doc_area", async () => {
  const badInput = { search_term: "intro", doc_area: "../" };
  await expect(
    get_sarvam_documentation_file(badInput, { SARVAM_API_KEY: "x" })
  ).rejects.toThrow(/invalid doc_area/i);
});

test("returns best-match md file", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "docs-"));
  writeFileSync(path.join(dir, "intro.md"), "# Intro\nHello Sarvam");
  const result = await get_sarvam_documentation_file(
    { search_term: "hello sarvam", doc_area: dir },
    { SARVAM_API_KEY: "x" }
  );
  expect(result.retrieved_file_path).toMatch(/intro\.md$/);
  rmdirSync(dir, { recursive: true });
}); 