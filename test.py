from ortools.sat.python import cp_model
import random
import pandas as pd

def build_timetable(seed=42, time_limit_seconds=30):
    random.seed(seed)

    # ---------- Parameters ----------
    departments = ["CSE", "ECE"]                # Departments
    semesters = ["SEM1", "SEM2"]                # Semesters
    divisions = ["D1", "D2"]                    # Divisions per semester
    rooms = [f"R{r+1}" for r in range(10)]      # Global room pool
    days = ["Mon", "Tue", "Wed", "Thu", "Fri"]  # Weekdays
    slots_per_day = 6                            # 6 periods/day  -> 30 slots/week
    teachers = [f"T{t+1}" for t in range(20)]   # Teacher pool
    subjects = [f"S{s+1}" for s in range(6)]    # Subjects (can differ by dept if you want)

    # Choose how many candidate teachers/rooms per class instance
    teachers_per_class = 3
    rooms_per_division = 4

    total_slots_per_week = len(days) * slots_per_day  # = 30

    # ---------- Subject repetition to fill 30 slots ----------
    # If 30 isn't divisible by number of subjects, distribute extras as evenly as possible.
    base = total_slots_per_week // len(subjects)
    extras = total_slots_per_week - base * len(subjects)
    subject_repeat_counts = {subj: base + (1 if i < extras else 0)
                             for i, subj in enumerate(subjects)}

    # Build repeated class instances: (dept, sem, div, subj, idx)
    classes = []
    for dept in departments:
        for sem in semesters:
            for div in divisions:
                for subj in subjects:
                    for idx in range(subject_repeat_counts[subj]):
                        classes.append((dept, sem, div, subj, idx))

    # Eligibility pools
    # Each class instance gets a small list of eligible teachers (chosen randomly)
    eligible_teachers = {c: random.sample(teachers, teachers_per_class) for c in classes}
    # Each (dept, sem, div) gets a subset of rooms it can use
    eligible_rooms_for_div = {(dept, sem, div): random.sample(rooms, rooms_per_division)
                              for dept in departments for sem in semesters for div in divisions}

    # ---------- CP-SAT Model ----------
    model = cp_model.CpModel()
    x = {}  # decision vars: x[(c, ti, ri, d, s)] in {0,1}

    for c in classes:
        dept, sem, div, subj, idx = c
        t_list = eligible_teachers[c]
        r_list = eligible_rooms_for_div[(dept, sem, div)]
        for ti in range(len(t_list)):
            for ri in range(len(r_list)):
                for d in range(len(days)):
                    for s in range(slots_per_day):
                        x[(c, ti, ri, d, s)] = model.NewBoolVar(
                            f"x_{dept}_{sem}_{div}_{subj}_{idx}_t{ti}_r{ri}_d{d}_s{s}"
                        )

    # 1) Each class instance scheduled exactly once
    for c in classes:
        dept, sem, div, subj, idx = c
        model.Add(sum(
            x[(c, ti, ri, d, s)]
            for ti in range(len(eligible_teachers[c]))
            for ri in range(len(eligible_rooms_for_div[(dept, sem, div)]))
            for d in range(len(days))
            for s in range(slots_per_day)
        ) == 1)

    # 2) For each (dept, sem, div) and each (day, slot), exactly one class occurs
    for dept in departments:
        for sem in semesters:
            for div in divisions:
                for d in range(len(days)):
                    for s in range(slots_per_day):
                        model.Add(sum(
                            x[(c, ti, ri, d, s)]
                            for c in classes if c[0] == dept and c[1] == sem and c[2] == div
                            for ti in range(len(eligible_teachers[c]))
                            for ri in range(len(eligible_rooms_for_div[(dept, sem, div)]))
                        ) == 1)

    # 3) Teacher clash: each teacher teaches at most one class per (day, slot)
    teacher_slot_vars = {(t, d, s): [] for t in teachers for d in range(len(days)) for s in range(slots_per_day)}
    for c in classes:
        dept, sem, div, subj, idx = c
        t_list = eligible_teachers[c]
        r_list = eligible_rooms_for_div[(dept, sem, div)]
        for ti, t in enumerate(t_list):
            for ri in range(len(r_list)):
                for d in range(len(days)):
                    for s in range(slots_per_day):
                        teacher_slot_vars[(t, d, s)].append(x[(c, ti, ri, d, s)])
    for t in teachers:
        for d in range(len(days)):
            for s in range(slots_per_day):
                model.Add(sum(teacher_slot_vars[(t, d, s)]) <= 1)

    # 4) Room clash: each room hosts at most one class per (day, slot)
    room_slot_vars = {(r, d, s): [] for r in rooms for d in range(len(days)) for s in range(slots_per_day)}
    for c in classes:
        dept, sem, div, subj, idx = c
        t_list = eligible_teachers[c]
        r_list = eligible_rooms_for_div[(dept, sem, div)]
        for ti in range(len(t_list)):
            for ri, r in enumerate(r_list):
                for d in range(len(days)):
                    for s in range(slots_per_day):
                        room_slot_vars[(r, d, s)].append(x[(c, ti, ri, d, s)])
    for r in rooms:
        for d in range(len(days)):
            for s in range(slots_per_day):
                model.Add(sum(room_slot_vars[(r, d, s)]) <= 1)

    # Objective: feasibility
    model.Minimize(0)

    # ---------- Solve ----------
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = time_limit_seconds
    status = solver.Solve(model)

    # ---------- Output ----------
    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        print("✅ Timetable Generated!\n")

        # Pretty weekly grids per Department–Semester–Division
        for dept in departments:
            for sem in semesters:
                for div in divisions:
                    print(f"\n📘 Timetable for {dept} - {sem} - {div}")
                    # Initialize empty grid
                    grid = {day: ["---"] * slots_per_day for day in days}

                    # Fill grid from solution
                    for subj in subjects:
                        # iterate all instances of this subject for this (dept, sem, div)
                        instances = [c for c in classes if c[0] == dept and c[1] == sem and c[2] == div and c[3] == subj]
                        for c in instances:
                            t_list = eligible_teachers[c]
                            r_list = eligible_rooms_for_div[(dept, sem, div)]
                            found = False
                            for ti, t in enumerate(t_list):
                                for ri, r in enumerate(r_list):
                                    for d in range(len(days)):
                                        for s in range(slots_per_day):
                                            if solver.Value(x[(c, ti, ri, d, s)]) == 1:
                                                grid[days[d]][s] = f"{subj} ({t}, {r})"
                                                found = True
                                                break
                                        if found: break
                                if found: break

                    # Print as DataFrame (Day × Slot1..Slot6)
                    df = pd.DataFrame.from_dict(grid, orient="index", columns=[f"Slot {i+1}" for i in range(slots_per_day)])
                    print(df.to_string())
    else:
        print("❌ No solution found")

if __name__ == "__main__":
    build_timetable()
