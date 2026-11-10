import "server-only";

import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

// Per-instance memory. On serverless this is best effort: it slows a burst from
// one address but is not a hard guarantee across instances.
const buckets = new Map<string, Bucket>();

function clientAddress() {
  const forwarded = headers().get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || headers().get("x-real-ip") || "unknown";
}

/** Returns true when the caller is still within `limit` attempts per window. */
export function allowRequest(scope: string, limit: number, windowMs: number) {
  const now = Date.now();
  const key = `${scope}:${clientAddress()}`;
  const bucket = buckets.get(key);

  if (buckets.size > 5000) {
    buckets.forEach((value, bucketKey) => {
      if (value.resetAt <= now) buckets.delete(bucketKey);
    });
  }

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  bucket.count += 1;
  return bucket.count <= limit;
}
