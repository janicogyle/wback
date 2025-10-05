import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'applications.json');

function readApplications() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeApplications(apps) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(apps, null, 2), 'utf-8');
}

export async function GET() {
  const apps = readApplications();
  return new Response(JSON.stringify(apps), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const apps = readApplications();
    const nextId = apps.reduce((max, a) => Math.max(max, a.id), 0) + 1;
    const newApp = { id: nextId, date: new Date().toISOString().split('T')[0], ...body };
    apps.push(newApp);
    writeApplications(apps);
    return new Response(JSON.stringify(newApp), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
