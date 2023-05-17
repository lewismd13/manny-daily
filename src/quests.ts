import { Quest, Task } from "grimoire-kolmafia";
import { inebrietyLimit, myDaycount, myInebriety, myPath } from "kolmafia";
import { $path, get } from "libram";

import {
  aprilShower,
  bafh,
  baggo,
  batfellowFood,
  breakStone,
  buyRaffleTix,
  checkNEP,
  csGashHop,
  defaultPrefs,
  detectiveSolver,
  doggieCoin,
  drunkGarbo,
  emptyHagnks,
  garbo,
  genericPvp,
  getDrunk,
  joinAFH,
  mafiaBreakfast,
  makeKeyPie,
  melfDupe,
  muffinHandler,
  nightcap,
  questCoino,
  randomPrank,
  randomSafari,
  rolloverPrep,
  stockShop,
  workshedSwap,
} from "./tasks";

export const firstLife: Quest<Task> = {
  name: "First lifetime",
  completed: () => myDaycount() === 1 && myPath() === $path`Community Service`, // this doesn't account for being in second aftercore
  tasks: [
    joinAFH,
    mafiaBreakfast,
    buyRaffleTix,
    detectiveSolver,
    questCoino,
    bafh,
    muffinHandler,
    stockShop,
    aprilShower,
    checkNEP,
    batfellowFood,
    ...garbo(true),
    baggo,
    getDrunk,
    drunkGarbo,
    genericPvp,
    randomSafari,
    randomPrank,
    csGashHop,
  ],
};

export const secondLife: Quest<Task> = {
  name: "Post-CS lifetime",
  completed: () => myDaycount() === 1 && myInebriety() > inebrietyLimit(),
  tasks: [
    joinAFH,
    breakStone,
    emptyHagnks,
    defaultPrefs,
    detectiveSolver,
    questCoino,
    melfDupe,
    makeKeyPie,
    doggieCoin,
    mafiaBreakfast,
    workshedSwap,
    stockShop,
    checkNEP,
    batfellowFood,
    ...garbo(false),
    baggo,
    bafh,
    randomSafari,
    randomPrank,
    nightcap,
    rolloverPrep,
  ],
};

// Currently unused
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
    mafiaBreakfast,
    stockShop,
    checkNEP,
  ],
};
