const limits = { coach: 24 };
const buckets = new Map();

function checkRateLimit(profile, actorId) {
  const limit = limits[profile];
  const key = `${profile}:${actorId}`;
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now >= current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return { ok: true };
  }

  if (current.count >= limit) {
    return { ok: false };
  }

  current.count += 1;
  return { ok: true };
}

const actor = "test-user";
let blocked = false;

for (let index = 0; index < 30; index += 1) {
  if (!checkRateLimit("coach", actor).ok) {
    blocked = true;
    break;
  }
}

const ok = blocked && !checkRateLimit("coach", actor).ok;
console.log(JSON.stringify({ ok, blocked }, null, 2));
process.exit(ok ? 0 : 1);
