import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'jobs.json');

function readJobs() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeJobs(jobs) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(jobs, null, 2), 'utf-8');
}

export async function GET() {
  const jobs = readJobs();
  return new Response(JSON.stringify(jobs), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const jobs = readJobs();
    const nextId = jobs.reduce((max, j) => Math.max(max, j.id), 0) + 1;
    const newJob = { id: nextId, ...body };
    jobs.push(newJob);
    writeJobs(jobs);
    return new Response(JSON.stringify(newJob), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
