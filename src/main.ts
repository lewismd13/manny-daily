import { Args, getTasks } from "grimoire-kolmafia";

import { MannyEngine } from "./engine";
import { firstLife, secondLife } from "./quests";

export const args = Args.create(
  "manny-daily",
  "Manny's script to do a half or full loop with all tasks.",
  {
    // TODO: csclass and casualclass args
    looptype: Args.string({
      help: "Do we want to do a full, half, or no loop",
      options: [
        ["none", "Do no loop."],
        ["CS", "Only do CS Loop"],
        ["casual", "Only do casual loop"],
      ],
      default: "CS",
    }),
    farmtype: Args.string({
      help: "What/how are we farming?",
      options: [
        ["garbo", "Just run garbo for meat."],
        ["baggo", "Run baggo."],
      ],
      default: "baggo",
    }),
    duffoAbort: Args.flag({
      help: "Abort to run duffo script if there's a Gerald(ine) quest?",
      default: true,
    }),
  }
);

export default function main(command?: string): void {
  Args.fill(args, command);
  if (args.help) {
    Args.showHelp(args);
    return;
  }

  const tasks = getTasks([firstLife(), secondLife()]);

  const engine = new MannyEngine(tasks);

  try {
    engine.run();
  } finally {
    engine.destruct();
  }
}
