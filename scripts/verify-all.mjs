import { spawn } from "node:child_process";

const steps = [
  { name: "typecheck", command: "npm", args: ["run", "typecheck"] },
  { name: "verify:history", command: "node", args: ["scripts/verify-scan-history.mjs"] },
  { name: "verify:rate-limit", command: "node", args: ["scripts/verify-rate-limit.mjs"] },
  { name: "verify:face-analyzer", command: "node", args: ["scripts/verify-face-analyzer.mjs"] }
];

const results = [];

for (const step of steps) {
  const code = await run(step.command, step.args);
  results.push({ name: step.name, ok: code === 0 });
}

const ok = results.every((result) => result.ok);
console.log(JSON.stringify({ ok, results }, null, 2));
process.exit(ok ? 0 : 1);

function run(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: false,
      env: process.env
    });

    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}
