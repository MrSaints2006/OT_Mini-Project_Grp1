import time

from metrics import PRIORITY_WEIGHT, compute_metrics, objective_weights

NO_DEADLINE = 1e9
TIME_LIMIT_SECONDS = 3


def make_slot(job, server, start):
    finish = start + job["rt"]
    return {
        "jid": job["id"],
        "name": job["name"],
        "sid": server["id"],
        "sname": server["name"],
        "pri": job["pri"],
        "start": start,
        "fin": finish,
        "cost": job["rt"] / 60 * server["cost"],
        "wait": start - job["arr"],
        "dl": job["dl"],
    }


def unscheduled_entry(job):
    return {
        "name": job["name"],
        "pri": job["pri"],
        "reason": f"No enabled server has \u2265 {job['vram']} GB VRAM",
    }


def earliest_finish(slot):
    return (slot["fin"], slot["cost"], slot["sid"])


def deadline_aware(slot):
    meets = slot["dl"] is None or slot["fin"] <= slot["dl"]
    if meets:
        return (0, slot["cost"], slot["fin"])
    return (1, slot["fin"], 0)


def list_schedule(order, pick_key, snap):
    free = {s["id"]: 0 for s in snap["servers"]}
    schedule, unscheduled = [], []
    for job in order:
        options = [
            make_slot(job, s, max(job["arr"], free[s["id"]]))
            for s in snap["servers"]
            if s["on"] and s["vram"] >= job["vram"]
        ]
        if not options:
            unscheduled.append(unscheduled_entry(job))
            continue
        options.sort(key=pick_key)
        best = options[0]
        free[best["sid"]] = best["fin"]
        schedule.append(best)
    return {"sch": schedule, "uns": unscheduled}


def fcfs(snap, objective):
    order = sorted(snap["jobs"], key=lambda j: (j["arr"], j["id"]))
    return list_schedule(order, earliest_finish, snap)


def sjf(snap, objective):
    order = sorted(snap["jobs"], key=lambda j: (j["rt"], j["id"]))
    return list_schedule(order, earliest_finish, snap)


def priority_deadline(snap, objective):
    def rank(job):
        deadline = job["dl"] if job["dl"] is not None else NO_DEADLINE
        return (-PRIORITY_WEIGHT[job["pri"]], deadline, job["id"])

    return list_schedule(sorted(snap["jobs"], key=rank), deadline_aware, snap)


def score(schedule, unscheduled, servers, objective):
    weights = objective_weights(objective)
    metrics = compute_metrics(schedule, unscheduled, servers)
    total = 0
    for item in unscheduled:
        total += 1e5 * PRIORITY_WEIGHT[item["pri"]]
    for slot in schedule:
        if slot["dl"] is not None and slot["fin"] > slot["dl"]:
            total += 1000 * PRIORITY_WEIGHT[slot["pri"]] * (slot["fin"] - slot["dl"])
    return total + weights["c"] * metrics["cost"] + weights["m"] * metrics["makespan"]


def exact_search(snap, objective):
    started = time.perf_counter()
    jobs, servers = snap["jobs"], snap["servers"]
    candidates = [
        [s for s in servers if s["on"] and s["vram"] >= j["vram"]] for j in jobs
    ]
    unscheduled = [unscheduled_entry(j) for j, c in zip(jobs, candidates) if not c]
    chosen = [None] * len(jobs)
    state = {"best": None, "best_score": float("inf"), "nodes": 0, "cut": False}

    def build_schedule():
        per_server = {}
        for i in range(len(jobs)):
            if chosen[i] is not None:
                per_server.setdefault(chosen[i]["id"], []).append(i)
        schedule = []
        for server_id in sorted(per_server):
            indexes = per_server[server_id]
            indexes.sort(
                key=lambda i: (
                    jobs[i]["dl"] if jobs[i]["dl"] is not None else NO_DEADLINE,
                    jobs[i]["arr"],
                )
            )
            clock = 0
            for i in indexes:
                slot = make_slot(jobs[i], chosen[i], max(jobs[i]["arr"], clock))
                clock = slot["fin"]
                schedule.append(slot)
        return schedule

    def search(i):
        if state["cut"]:
            return
        if i == len(jobs):
            state["nodes"] += 1
            schedule = build_schedule()
            value = score(schedule, unscheduled, servers, objective)
            if value < state["best_score"]:
                state["best_score"], state["best"] = value, schedule
            if state["nodes"] & 1023 == 0:
                if time.perf_counter() - started > TIME_LIMIT_SECONDS:
                    state["cut"] = True
            return
        if not candidates[i]:
            chosen[i] = None
            search(i + 1)
            return
        for server in candidates[i]:
            chosen[i] = server
            search(i + 1)

    search(0)
    status = (
        "time limit \u2013 best feasible found"
        if state["cut"]
        else "optimal within model (all assignments searched, EDD order per GPU)"
    )
    return {
        "sch": state["best"] or [],
        "uns": unscheduled,
        "status": status,
        "nodes": state["nodes"],
    }


ALGORITHMS = {
    "fcfs": ("FCFS", fcfs),
    "sjf": ("SJF", sjf),
    "prio": ("Priority + deadline", priority_deadline),
    "exact": ("Exact search", exact_search),
}


def run_algorithm(key, snap, objective):
    if key not in ALGORITHMS:
        raise ValueError(f"unknown algorithm: {key}")
    name, solver = ALGORITHMS[key]
    started = time.perf_counter()
    result = solver(snap, objective)
    result["ms"] = (time.perf_counter() - started) * 1000
    result["algo"] = name
    result.setdefault("status", "heuristic")
    result["m"] = compute_metrics(result["sch"], result["uns"], snap["servers"])
    result["snap"] = snap
    return result
