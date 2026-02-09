import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('Upstash Redis not configured. Submissions will not be stored.');
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}

export interface StoredSubmission {
  id: string;
  respondent: {
    name: string;
    email: string;
    role: string;
  };
  responses: Record<string, any>;
  completionRate: number;
  submittedAt: string;
  storedAt: string;
}

export async function storeSubmission(submission: Omit<StoredSubmission, 'id' | 'storedAt'>): Promise<string | null> {
  const db = getRedis();
  if (!db) return null;

  const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const stored: StoredSubmission = {
    ...submission,
    id,
    storedAt: new Date().toISOString(),
  };

  // Store the submission
  await db.set(`submission:${id}`, JSON.stringify(stored));

  // Add to sorted set for listing (score = timestamp)
  await db.zadd('submissions:all', {
    score: Date.now(),
    member: id,
  });

  return id;
}

export async function getSubmissions(limit = 100, offset = 0): Promise<StoredSubmission[]> {
  const db = getRedis();
  if (!db) return [];

  // Get IDs sorted by newest first
  const ids = await db.zrange('submissions:all', offset, offset + limit - 1, { rev: true });

  if (!ids || ids.length === 0) return [];

  // Fetch all submissions
  const pipeline = db.pipeline();
  for (const id of ids) {
    pipeline.get(`submission:${id}`);
  }
  const results = await pipeline.exec();

  return results
    .filter((r): r is string => r !== null)
    .map((r) => {
      try {
        return typeof r === 'string' ? JSON.parse(r) : r;
      } catch {
        return null;
      }
    })
    .filter((r): r is StoredSubmission => r !== null);
}

export async function getSubmission(id: string): Promise<StoredSubmission | null> {
  const db = getRedis();
  if (!db) return null;

  const data = await db.get(`submission:${id}`);
  if (!data) return null;

  try {
    return typeof data === 'string' ? JSON.parse(data) : data as StoredSubmission;
  } catch {
    return null;
  }
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const db = getRedis();
  if (!db) return false;

  await db.del(`submission:${id}`);
  await db.zrem('submissions:all', id);
  return true;
}

export async function getSubmissionCount(): Promise<number> {
  const db = getRedis();
  if (!db) return 0;

  return await db.zcard('submissions:all') || 0;
}
