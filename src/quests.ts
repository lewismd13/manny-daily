import { Quest, Task } from "grimoire-kolmafia";
import { inebrietyLimit, myDaycount, myInebriety } from "kolmafia";
import { get } from "libram";

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
  goToGAP,
  joinAFH,
  mafiaBreakfast,
  makeKeyPie,
  melfDupe,
  muffinHandler,
  nightcap,
  questCoino,
  randomPrank,
  randomSafari,
  returnGAP,
  rolloverPrep,
  stockShop,
  workshedSwap,
} from "./tasks";

export function firstLife(): Quest<Task> {
  return {
    name: "First lifetime",
    completed: () => get("ascensionsToday") > 0,
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
      goToGAP,
      ...garbo(true),
      baggo,
      getDrunk,
      randomPrank,
      drunkGarbo,
      genericPvp,
      randomSafari,
      csGashHop,
    ],
  };
}

export function secondLife(): Quest<Task> {
  return {
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
      returnGAP,
      nightcap,
      randomSafari,
      randomPrank,
      rolloverPrep,
    ],
  };
}

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
