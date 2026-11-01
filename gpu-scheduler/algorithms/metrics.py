import math

PRIORITY_WEIGHT = {"High": 3, "Medium": 2, "Low": 1}


def js_round(value):
    """Round half up, matching the numbers shown in the interface."""
    return math.floor(value + 0.5)


def number_text(value):
    """Format a number without a trailing .0 so traces read cleanly."""
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value)


def objective_weights(objective):
    if objective == "cost":
        return {"c": 1, "m": 0.1}
    if objective == "makespan":
        return {"c": 0.01, "m": 10}
    return {"c": 1, "m": 10}


def compute_metrics(schedule, unscheduled, servers):
    enabled = sum(1 for s in servers if s["on"])
    makespan = max((x["fin"] for x in schedule), default=0)
    busy = sum(x["fin"] - x["start"] for x in schedule)
    late = [x for x in schedule if x["dl"] is not None and x["fin"] > x["dl"]]
    return {
        "scheduled": len(schedule),
        "unscheduled": len(unscheduled),
        "makespan": makespan,
        "cost": sum(x["cost"] for x in schedule),
        "avgWait": sum(x["wait"] for x in schedule) / len(schedule) if schedule else 0,
        "misses": len(late),
        "lateMin": sum(x["fin"] - x["dl"] for x in late),
        "util": busy / (enabled * makespan) if makespan and enabled else 0,
    }
