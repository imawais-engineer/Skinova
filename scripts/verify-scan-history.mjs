function buildHistoryTrend(history) {
  if (!history.length) return null;
  const latest = history[0];
  const previous = history[1] || null;
  const delta = previous ? latest.overall - previous.overall : 0;
  return {
    scanCount: history.length,
    latest,
    previous,
    delta,
    direction: delta > 0 ? "up" : delta < 0 ? "down" : "flat"
  };
}

function describeHistoryDelta(trend) {
  if (!trend.previous) {
    return `${trend.scanCount} scan${trend.scanCount === 1 ? "" : "s"} saved to your account.`;
  }
  if (trend.direction === "flat") {
    return `${trend.scanCount} scans · overall score steady since your last scan.`;
  }
  const verb = trend.direction === "up" ? "up" : "down";
  const points = Math.abs(trend.delta);
  return `${trend.scanCount} scans · overall ${verb} ${points} point${points === 1 ? "" : "s"} since your last scan.`;
}

const history = [
  { id: "b", overall: 88 },
  { id: "a", overall: 82 }
];
const trend = buildHistoryTrend(history);
const summary = describeHistoryDelta(trend);
const ok = trend.delta === 6 && trend.direction === "up" && summary.includes("6 points");

console.log(JSON.stringify({ ok, trend, summary }, null, 2));
process.exit(ok ? 0 : 1);
