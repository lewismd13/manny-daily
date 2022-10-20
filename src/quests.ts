import { Quest, Task } from "grimoire-kolmafia";
import { myDaycount } from "kolmafia";
import { get } from "libram";

import {
  aprilShower,
  bafh,
  buyRaffleTix,
  checkNEP,
  csGashHop,
  defaultPrefs,
  detectiveSolver,
  doggieCoin,
  emptyHagnks,
  getDrunk,
  joinAFH,
  mafiaBreakfast,
  makeKeyPie,
  melfDupe,
  muffinHandler,
  questCoino,
  seasonalPvp,
  stockShop,
} from "./tasks";

export const firstLife: Quest<Task> = {
  name: "First lifetime",
  completed: () => myDaycount() === 1,
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
    // duffo
    // garbo
    // baggo if running
    getDrunk,
    // garbo/baggo,
    seasonalPvp,
    csGashHop,
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
