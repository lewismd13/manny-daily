import { Quest, Task } from "grimoire-kolmafia";
import { get } from "libram";

import {
  aprilShower,
  bafh,
  buyRaffleTix,
  checkNEP,
  defaultPrefs,
  detectiveSolver,
  doggieCoin,
  emptyHagnks,
  joinAFH,
  mafiaBreakfast,
  makeKeyPie,
  melfDupe,
  muffinHandler,
  questCoino,
  stockShop,
} from "./tasks";

export const mannyBreakfast: Quest<Task> = {
  name: "Full Breakfast",
  completed: () => get("_aprilShower"), // not sure about this
  tasks: [
    joinAFH,
    mafiaBreakfast,
    buyRaffleTix,
    detectiveSolver,
    questCoino,
    bafh,
    muffinHandler,
    checkNEP,
    stockShop,
    aprilShower,
  ],
};

export const postloop: Quest<Task> = {
  name: "Postloop",
  completed: () => get("breakfastCompleted"),
  tasks: [
    joinAFH,
    emptyHagnks,
    defaultPrefs,
    detectiveSolver,
    questCoino,
    melfDupe,
    makeKeyPie,
    doggieCoin,
    checkNEP,
    mafiaBreakfast,
    stockShop,
    checkNEP,
  ],
};
