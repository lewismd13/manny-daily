/*
Remaining breakfast tasks:
check NEP quest
bafh wls*
*/
import { Task } from "grimoire-kolmafia";
import {
  adv1,
  availableAmount,
  cliExecute,
  closetAmount,
  containsText,
  equip,
  getWorkshed,
  inebrietyLimit,
  isHeadless,
  itemAmount,
  myInebriety,
  myPath,
  myStorageMeat,
  print,
  putCloset,
  putShop,
  pvpAttacksLeft,
  random,
  retrieveItem,
  setAutoAttack,
  setProperty,
  storageAmount,
  takeCloset,
  toInt,
  use,
  useFamiliar,
  userConfirm,
  useSkill,
} from "kolmafia";
import {
  $class,
  $effect,
  $familiar,
  $item,
  $items,
  $location,
  $path,
  $skill,
  ascend,
  AsdonMartin,
  Clan,
  get,
  have,
  Lifestyle,
  Macro,
  prepareAscension,
  SongBoom,
} from "libram";

import { bafhWls, breakfastCounter, mannyQuestVolcoino, playerTargets, setChoice } from "./lib";

export const mafiaBreakfast: Task = {
  name: "Mafia Breakfast",
  completed: () => get("breakfastCompleted"),
  do: () => cliExecute("breakfast"),
};

export const buyRaffleTix: Task = {
  name: "Raffle tix",
  completed: () => itemAmount($item`raffle ticket`) > 0,
  do: (): void => {
    cliExecute(`raffle ${5 + random(5)}`);
  },
};

export const joinAFH: Task = {
  name: "Join AFH",
  completed: () => Clan.get().id === 40382,
  do: () => Clan.join(40382),
};

export const aprilShower: Task = {
  name: "April Shower",
  completed: () => get("_aprilShower"),
  do: () => cliExecute("shower cold"),
};

export const detectiveSolver: Task = {
  name: "Detective Solver",
  completed: () => get("_detectiveCasesCompleted") === 3,
  do: () => cliExecute("detective solver"),
};

// TODO: probably put the whole function in here, instead of in lib
export const questCoino: Task = {
  name: "Quest Volcoino",
  completed: () => get("_volcanoItemRedeemed"),
  do: mannyQuestVolcoino,
  limit: { tries: 1 },
};

export const bafh: Task = {
  name: "BAFH WLs",
  completed: () => get("_bafhWlsDone", false),
  do: bafhWls,
};

export const muffinHandler: Task = {
  name: "Muffin Handler",
  completed: () => get("muffinOnOrder") === "none",
  ready: () => get("muffinOnOrder") === "blueberry",
  do: breakfastCounter,
};

export const checkNEP: Task = {
  name: "Check NEP Quest",
  completed: () => get("_questPartyFairQuest") !== "",
  ready: () => !get("_questPartyFairQuest"),
  outfit: {
    avoid: [$item`Kramco Sausage-o-Matic™`, $item`June cleaver`],
    familiar: $familiar`Frumious Bandersnatch`,
  },
  do: () => {
    setChoice(1322, 6); // Leave
    adv1($location`The Neverending Party`, -1, "");
    if (get("_questPartyFairQuest") === "food") {
      print("Hey, go talk to Geraldine, time for another sliderpocalypse!", "yellow");
    } else if (get("_questPartyFairQuest") === "booze") {
      print("Hey, go talk to Gerald, get that jarmageddon!", "yellow");
    } else print(`Sorry, your NEP quest is ${get("_questPartyFairQuest")}.`);
  },
};

const stockables = $items`11-leaf clover, battery (AAA), cornucopia, pocket wish, cute mushroom, gift card, abandoned candy`;

export const stockShop: Task = {
  name: "Stock Mallstore",
  completed: () => {
    for (const item of stockables) {
      if (itemAmount(item)) {
        return false;
      } else continue;
    }
    return true;
  },
  do: () => {
    for (const item of stockables) {
      putShop(0, 0, itemAmount(item), item);
    }
  },
};

// TODO: Make full vs half loop an argument that sets a global option
export const workshedSwap: Task = {
  name: "Workshed Swap",
  completed: () => {
    if (get("_workshedItemUsed") || get("csServicesPerformed")) return true;
    else return false;
  },
  ready: () => !get("_workshedItemUsed"),
  do: () => {
    if (!get("csServicesPerformed") || isHeadless()) {
      // headless or in casual aftercore, drive observantly and swap to cmc
      if (getWorkshed() === $item`Asdon Martin keyfob`) {
        AsdonMartin.drive($effect`Driving Observantly`, 1100);
        use($item`cold medicine cabinet`);
        // use($item`snow machine`);
      }
    } else if (!userConfirm("will you be doing a casual today?")) {
      // in CS aftercore, half-looping, still swap
      if (getWorkshed() === $item`Asdon Martin keyfob`) {
        AsdonMartin.drive($effect`Driving Observantly`, 1100);
        use($item`cold medicine cabinet`);
      }
    }
  },
};

export const makeKeyPie: Task = {
  name: "Make a key pie",
  ready: () => !get("lockPicked"),
  completed: () => get("lockPicked"),
  do: () => {
    setChoice(1414, 1);
    useSkill(1, $skill`Lock Picking`);
    cliExecute("create 1 boris's key lime pie");
  },
};

export const melfDupe: Task = {
  name: "Machine Elf Dupe",
  ready: () => get("encountersUntilDMTChoice") === 0,
  completed: () => get("encountersUntilDMTChoice") > 0,
  do: () => {
    const dupeTarget = $item`bottle of Greedy Dog`;
    if (itemAmount(dupeTarget) === 0 && closetAmount(dupeTarget) > 0) takeCloset(1, dupeTarget);
    if (availableAmount(dupeTarget) > 0) {
      useFamiliar($familiar`Machine Elf`);
      setChoice(1119, 4);
      setProperty("choiceAdventure1125", `1&iid=${toInt(dupeTarget)}`);
      adv1($location`The Deep Machine Tunnels`, -1, "");
      // putShop(0, 0, 1, dupeTarget);
      putCloset(1, dupeTarget);
    } else {
      print(`Something went wrong duping a ${dupeTarget.name}`, "red");
    }
  },
};

export const doggieCoin: Task = {
  name: "Caldera Volcoino",
  ready: () => !containsText($location`The Bubblin' Caldera`.noncombatQueue, "Lava Dogs"),
  completed: () => containsText($location`The Bubblin' Caldera`.noncombatQueue, "Lava Dogs"),
  prepare: () => {
    if (have($effect`Spirit of Cayenne`)) useSkill($skill`Spirit of Nothing`);

    retrieveItem(20, $item`heat-resistant sheet metal`);
    Macro.trySkill($skill`Curse of Weaksauce`)
      .trySkill($skill`Stuffed Mortar Shell`)
      .trySkill($skill`Extract`)
      .skill($skill`Saucestorm`)
      .repeat()
      .setAutoAttack();
  },
  do: () => {
    while (!containsText($location`The Bubblin' Caldera`.noncombatQueue, "Lava Dogs")) {
      useFamiliar($familiar`Mini-Hipster`);
      equip($item`Kramco Sausage-o-Matic™`);
      adv1($location`The Bubblin' Caldera`);
    }
  },
  post: () => {
    setAutoAttack(0);
    if (have($effect`Drenched in Lava`)) cliExecute("soak");
  },
};

export const emptyHagnks: Task = {
  name: "Empty Hagnk's",
  completed: () => myStorageMeat() === 0 && storageAmount($item`Ol' Scratch's stovepipe hat`) === 0,
  do: () => cliExecute("pull all"),
};

// TODO: grimoire-ify the prefs
export const defaultPrefs: Task = {
  name: "Set default prefs",
  completed: () =>
    get("autoSatisfyWithNPCs") === true &&
    get("mpAutoRecovery") === 0.1 &&
    get("logPreferenceChange") === false &&
    get("backupCameraReverserEnabled"),
  do: () => {
    cliExecute("ccs default");
    setProperty("autoSatisfyWithNPCs", "true");
    setProperty("hpAutoRecovery", "0.7");
    setProperty("hpAutoRecoveryTarget", "0.95");
    setProperty("mpAutoRecovery", "0.1");
    setProperty("mpAutoRecoveryTarget", "0.3");
    if (get("logPreferenceChange")) setProperty("logPreferenceChange", "false");
    if (SongBoom.song() !== "Food Vibrations") SongBoom.setSong("Food Vibrations");
    if (!get("backupCameraReverserEnabled")) cliExecute("backupcamera reverser on");
  },
};

export const getDrunk: Task = {
  name: "Overdrink (not nightcap)",
  completed: () => myInebriety() > inebrietyLimit(),
  do: () => {
    if (get("familiarSweat") > 210) {
      useFamiliar($familiar`Stooper`);
      cliExecute("drink stillsuit distillate");
      cliExecute("CONSUME NIGHTCAP NOMEAT VALUE 4000");
    } else {
      cliExecute("CONSUME NIGHTCAP NOMEAT VALUE 4000");
    }
  },
};

export const nightcap: Task = {
  name: "Nightcap",
  completed: () => myInebriety() > inebrietyLimit(),
  do: () => {
    if (get("familiarSweat") > 210) {
      useFamiliar($familiar`Stooper`);
      cliExecute("drink stillsuit distillate");
      cliExecute("CONSUME NIGHTCAP NOMEAT VALUE 4000");
    } else {
      cliExecute("CONSUME NIGHTCAP NOMEAT VALUE 4000");
    }
  },
};

export const randomSafari: Task = {
  name: "Random Safari casts",
  completed: () => $skill`Experience Safari`.timescast >= get("skillLevel180"),
  do: () =>
    useSkill(
      $skill`Experience Safari`,
      1,
      playerTargets[Math.round(Math.random() * playerTargets.length)]
    ),
  limit: { tries: 10 },
};

export const randomPrank: Task = {
  name: "Random timepranks",
  completed: () => get("_timeSpinnerMinutesUsed") >= 10,
  do: () =>
    cliExecute(
      `timespinner prank ${playerTargets[Math.round(Math.random() * playerTargets.length)]}`
    ),
  limit: { tries: 15 },
};

export const genericPvp: Task = {
  name: "pvp",
  completed: () => pvpAttacksLeft() === 0,
  do: () => cliExecute("UberPVPOptimizer; swagger"),
};

export const seasonalPvp: Task = {
  name: "pvp",
  completed: () => pvpAttacksLeft() === 0,
  do: () => cliExecute("UberPVPOptimizer; pvp loot ASCII"),
};

export const csGashHop: Task = {
  name: "Hop into CS",
  completed: () => get("csServicesPerformed") !== "" || myPath() === $path`Community Service`,
  do: () => {
    prepareAscension({
      workshed: "Asdon Martin keyfob",
      garden: "Peppermint Pip Packet",
      eudora: "Our Daily Candles™ order form",

      chateau: {
        desk: "Swiss piggy bank",
        nightstand: "foreign language tapes",
        ceiling: "ceiling fan",
      },
    });

    ascend(
      $path`Community Service`,
      $class`Pastamancer`,
      Lifestyle.hardcore,
      "wallaby",
      $item`astral six-pack`,
      $item`astral statuette`
    );
  },
};
