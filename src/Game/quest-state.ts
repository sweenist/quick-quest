import { DialogScenario } from "../Actors/verbal-actor";

class QuestState {
  flags: Map<string, boolean> = new Map<string, boolean>();

  add(flag: string) {
    this.flags.set(flag, true);
  }

  getScenario(scenarios: DialogScenario[]): DialogScenario | null {
    return (
      scenarios.find((scene) => {
        console.warn(scene);
        const bypass = scene.bypass ?? [];
        for (let i = 0; i < bypass.length; i++) {
          const currentFlag = bypass[i];
          if (this.flags.has(currentFlag)) {
            return false;
          }
        }

        const required = scene.requires ?? [];
        for (let i = 0; i < required.length; i++) {
          const essential = required[i];
          if (!this.flags.has(essential)) {
            return false;
          }
        }
        return true;
      }) ?? null
    );
  }
}

export const questState = new QuestState();