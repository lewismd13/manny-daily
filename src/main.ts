import { Args } from "grimoire-kolmafia";

export const args = Args.create(
  "manny-daily",
  "Manny's script to do a half or full loop witha all tasks.",
  {
    looptype: Args.string({
      help: "Do we want to do a full, half, or no loop",
      options: [
        ["none", "Do no loop."],
        ["half", "Only do CS Loop"],
        ["full", "do CS and casual"],
      ],
      default: "full",
    }),
    buff: Args.flag({ help: "Only buff up, do not spend any adventures.", default: false }),
    farmtype: Args.string({
      help: "What/how are we farming?",
      options: [
        ["garbo", "Just run garbo for meat."],
        ["baggo", "Run baggo with no arguments."],
        ["baggo-duffel", "Run baggo and sniff jocks."],
        ["baggo-key", "Run baggo and sniff burnouts."],
      ],
      default: "garbo",
    }),
  }
);

export default function main(command?: string): void {
  Args.fill(args, command);
  if (args.help) {
    Args.showHelp(args);
    return;
  }

  console.log("You have successfully built manny-daily!");
}
