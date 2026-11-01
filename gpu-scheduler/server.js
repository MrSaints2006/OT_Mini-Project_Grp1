const express = require("express");
const path = require("path");
const { spawn } = require("child_process");

const PORT = process.env.PORT || 3000;
const PYTHON = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const RUNNER = path.join(__dirname, "algorithms", "run.py");
const ALGORITHMS = ["fcfs", "sjf", "prio", "exact"];
const OBJECTIVES = ["cost", "makespan", "balanced"];
const SOLVER_TIMEOUT_MS = 15000;

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function solve(payload) {
  return new Promise((resolve, reject) => {
    const child = spawn(PYTHON, [RUNNER]);
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("solver timed out"));
    }, SOLVER_TIMEOUT_MS);

    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(new Error(`could not start ${PYTHON}: ${err.message}`));
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        const lines = stderr.trim().split("\n");
        return reject(new Error(lines[lines.length - 1] || "solver failed"));
      }
      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(new Error("solver returned invalid output"));
      }
    });
    child.stdin.end(JSON.stringify(payload));
  });
}

function validSnapshot(s) {
  return (
    s &&
    Array.isArray(s.servers) &&
    Array.isArray(s.jobs) &&
    s.servers.every((x) => x && typeof x.on === "boolean" && x.vram > 0 && x.cost >= 0) &&
    s.jobs.every((x) => x && x.rt > 0 && x.vram > 0 && ["High", "Medium", "Low"].includes(x.pri))
  );
}

function route(action, check) {
  app.post(`/api/${action}`, async (req, res) => {
    const body = req.body || {};
    if (!validSnapshot(body.snapshot)) {
      return res.status(400).json({ error: "invalid jobs or servers" });
    }
    const problem = check(body);
    if (problem) return res.status(400).json({ error: problem });
    try {
      res.json(await solve({ ...body, action }));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}

const objectiveOk = (b) => (OBJECTIVES.includes(b.objective) ? null : "unknown objective");
route("run", (b) => (ALGORITHMS.includes(b.algo) ? objectiveOk(b) : "unknown algorithm"));
route("compare", objectiveOk);
route("transport", (b) => (b.capacity > 0 ? null : "capacity must be greater than 0"));

app.listen(PORT, () => console.log(`GPU Scheduler running at http://localhost:${PORT}`));
