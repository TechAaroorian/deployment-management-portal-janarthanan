import { appendFileSync, readFileSync } from "node:fs";

const { total } = JSON.parse(readFileSync("coverage/coverage-summary.json", "utf8"));
const rows = ["statements", "branches", "functions", "lines"].map((metric) => {
  const { pct, covered, total: count } = total[metric];
  return `| ${metric} | ${pct}% | ${covered}/${count} |`;
});

const summary = [
  "## Test coverage",
  "",
  "| Metric | Coverage | Covered/total |",
  "| --- | ---: | ---: |",
  ...rows,
  "",
  "Download **coverage-report** from this run for the HTML, LCOV, and Cobertura reports.",
  "",
].join("\n");

console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
}
