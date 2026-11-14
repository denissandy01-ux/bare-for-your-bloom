import { describe, expect, it } from "vitest";
import { addEntry, addGoal, addReply, removeGoal, toggleGoal } from "@/lib/journey";

const empty = { goals: [], entries: [] };
describe("beauty journey", () => {
  it("ignores blank goals", () => expect(addGoal(empty, { title: "  ", area: "Even tone" }).goals).toHaveLength(0));
  it("adds a reply to an existing entry without changing it", () => {
    let j = addEntry(empty, { text: "Week one" });
    j = addReply(j, j.entries[0]!.id, "Looking back, it helped");
    expect(j.entries[0]!.text).toBe("Week one");
    expect(j.entries[0]!.replies.map((r) => r.text)).toEqual(["Looking back, it helped"]);
  });
  it("removing a goal keeps its journal entries", () => {
    let j = addGoal(empty, { title: "Calm", area: "Barrier repair & calm" });
    const id = j.goals[0]!.id;
    j = addEntry(j, { text: "note", goalId: id });
    j = removeGoal(j, id);
    expect(j.entries).toHaveLength(1);
    expect(j.entries[0]!.goalId).toBeUndefined();
  });
  it("toggles a goal reached and back", () => {
    let j = addGoal(empty, { title: "Calm", area: "Even tone" });
    j = toggleGoal(j, j.goals[0]!.id); expect(j.goals[0]!.done).toBeTruthy();
    j = toggleGoal(j, j.goals[0]!.id); expect(j.goals[0]!.done).toBeUndefined();
  });
});
