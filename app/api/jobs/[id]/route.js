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

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    const jobs = readJobs();
    const job = jobs.find(j => Number(j.id) === id);
    if (!job) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    return new Response(JSON.stringify(job), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PATCH(req, { params }) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const jobs = readJobs();
    const idx = jobs.findIndex(j => Number(j.id) === id);
    if (idx === -1) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    const updated = { ...jobs[idx], ...body, id };
    jobs[idx] = updated;
    writeJobs(jobs);
    return new Response(JSON.stringify(updated), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    let jobs = readJobs();
    const idx = jobs.findIndex(j => Number(j.id) === id);
    if (idx === -1) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    jobs = jobs.filter(j => Number(j.id) !== id);
    writeJobs(jobs);
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
