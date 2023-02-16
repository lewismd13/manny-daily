/*
Remaining breakfast tasks:
check NEP quest
bafh wls*
*/
import { Task } from "grimoire-kolmafia";
import {
  adv1,
  availableAmount,
  buy,
  cliExecute,
  closetAmount,
  containsText,
  drinksilent,
  eatsilent,
  equip,
  equippedItem,
  eudoraItem,
  fullnessLimit,
  getCampground,
  getWorkshed,
  haveEffect,
  hippyStoneBroken,
  inebrietyLimit,
  itemAmount,
  maximize,
  myAdventures,
  myDaycount,
  myFamiliar,
  myFullness,
  myGardenType,
  myInebriety,
  myPath,
  mySpleenUse,
  myStorageMeat,
  print,
  putCloset,
  putShop,
  pvpAttacksLeft,
  random,
  retrieveItem,
  setAutoAttack,
  setProperty,
  spleenLimit,
  storageAmount,
  sweetSynthesis,
  takeCloset,
  toInt,
  use,
  useFamiliar,
  useSkill,
  visitUrl,
} from "kolmafia";
import {
  $effect,
  $familiar,
  $item,
  $items,
  $location,
  $path,
  $skill,
  $slot,
  AsdonMartin,
  ChateauMantegna,
  Clan,
  get,
  have,
  Macro,
  SongBoom,
} from "libram";

import {
  bafhWls,
  breakfastCounter,
  cliExecuteThrow,
  mannyQuestVolcoino,
  playerTargets,
  setChoice,
} from "./lib";
import { args } from "./main";

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
  completed: () => get("_volcanoItemRedeemed") || get("_volcanoItem1") !== 8523,
  do: mannyQuestVolcoino,
  limit: { tries: 1 },
};

export const bafh: Task = {
  name: "BAFH WLs",
  completed: () => get("_bafhWlsDone") === "1",
  do: bafhWls,
};

export const muffinHandler: Task = {
  name: "Muffin Handler",
  completed: () => get("muffinOnOrder") === "none",
  ready: () => get("muffinOnOrder") === "blueberry",
  do: breakfastCounter,
};

// TODO: Make sure this doesn't try to run if you've already rejected a quest
export const checkNEP: Task = {
  name: "Check NEP Quest",
  completed: () => get("_questPartyFairQuest") !== "",
  ready: () => get("_questPartyFair") === "unstarted",
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
    if (args.duffoAbort) {
      if (get("_questPartyFairQuest") === "food" || get("_questPartyFairQuest") === "booze")
        throw "Time to run duffo";
    }
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

export const workshedSwap: Task = {
  name: "Workshed Swap",
  completed: () => get("_workshedItemUsed"),
  ready: () => myDaycount() === 1 && getWorkshed() === $item`Asdon Martin keyfob`,
  do: () => {
    AsdonMartin.drive($effect`Driving Observantly`, 1300);
    use($item`cold medicine cabinet`);
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
    const dupeTarget = $item`chocomotive`;
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
    if (myInebriety() === inebrietyLimit() && myFullness() === fullnessLimit()) {
      if (myFamiliar() !== $familiar`Stooper`) {
        useFamiliar($familiar`Stooper`);
        useSkill($skill`The Ode to Booze`, 1);
        if (availableAmount($item`astral pilsner`) > 0) {
          drinksilent($item`astral pilsner`);
        } else if (get("familiarSweat") > 210) {
          cliExecute("drink stillsuit distillate");
        } else {
          drinksilent($item`splendid martini`);
        }
      }
      useSkill($skill`The Ode to Booze`, 1);
      if (haveEffect($effect`Ode to Booze`) < 5) useSkill($skill`The Ode to Booze`);
      retrieveItem($item`jar of fermented pickle juice`);
      drinksilent($item`jar of fermented pickle juice`);
      while (mySpleenUse() < spleenLimit()) {
        sweetSynthesis($effect`Synthesis: Greed`);
      }
    } else if (myInebriety() > inebrietyLimit() && myFullness() === fullnessLimit()) {
      print("you're all good in the hood");
    } else {
      throw "are you sure you want to overdrink? you have some open organ space";
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

export const breakStone: Task = {
  name: "Break Hippy Stone",
  completed: () => hippyStoneBroken(),
  do: () => visitUrl("peevpee.php?action=smashstone&confirm=on"),
};

export const genericPvp: Task = {
  name: "pvp",
  completed: () => pvpAttacksLeft() === 0,
  do: () => cliExecute("UberPVPOptimizer; swagger"),
};

export const seasonalPvp: Task = {
  name: "pvp",
  completed: () => pvpAttacksLeft() === 0,
  do: () => cliExecute("UberPVPOptimizer; pvp loot ephemeral"),
};

// TODO: add arguments for HC/SC
export const csGashHop: Task = {
  name: "Hop into CS",
  completed: () => get("csServicesPerformed") !== "" || myPath() === $path`Community Service`,
  do: () => {
    cliExecuteThrow("hccsAscend");
  },
};

export function garbo(ascend: boolean): Task[] {
  let garboArguments = "";
  if (ascend) garboArguments = garboArguments.concat(" ascend");
  if (args.farmtype.includes("baggo")) garboArguments = garboArguments.concat(" nobarf");
  return [
    {
      name: "Garbo",
      ready: () => myAdventures() > 0 && myInebriety() < inebrietyLimit(),
      completed: () => myAdventures() === 0 || myInebriety() > inebrietyLimit(),
      do: () => cliExecuteThrow(`garbo${garboArguments}`),
    },
  ];
}

export const drunkGarbo: Task = {
  name: "Overdrunk Garbo",
  ready: () => myAdventures() > 0 && myInebriety() > inebrietyLimit(),
  completed: () => myAdventures() === 0 && myInebriety() > inebrietyLimit(),
  do: () => cliExecuteThrow(`garbo ascend`),
};

export const baggo: Task = {
  name: "Baggo",
  do: () => cliExecuteThrow(`baggo`),
  completed: () =>
    myAdventures() === 0 || myInebriety() > inebrietyLimit() || args.farmtype === "garbo",
};

export const batfellowFood: Task = {
  name: "Eat/drink batfellow",
  completed: () => get("_mrBurnsgerEaten") && get("_docClocksThymeCocktailDrunk"),
  ready: () => inebrietyLimit() - myInebriety() >= 4 && fullnessLimit() - myFullness() >= 4,
  do: () => {
    if (!get("_milkOfMagnesiumUsed")) use($item`milk of magnesium`);
    if (myInebriety() >= 2) {
      if (!itemAmount($item`Mr. Burnsger`)) takeCloset($item`Mr. Burnsger`);
      eatsilent($item`Mr. Burnsger`);
      if (haveEffect($effect`Ode to Booze`) < 4) useSkill($skill`The Ode to Booze`);
      if (!itemAmount($item`Doc Clock's thyme cocktail`))
        takeCloset($item`Doc Clock's thyme cocktail`);
      drinksilent($item`Doc Clock's thyme cocktail`);
    } else {
      if (have($item`blueberry muffin`)) {
        eatsilent($item`blueberry muffin`);
        retrieveItem($item`Boris's bread`);
        eatsilent($item`Boris's bread`);
      } else {
        retrieveItem($item`Deep Dish of Legend`);
        eatsilent($item`Deep Dish of Legend`);
      }
      if (!itemAmount($item`Mr. Burnsger`)) takeCloset($item`Mr. Burnsger`);
      eatsilent($item`Mr. Burnsger`);
      if (haveEffect($effect`Ode to Booze`) < 4) useSkill($skill`The Ode to Booze`);
      if (!itemAmount($item`Doc Clock's thyme cocktail`))
        takeCloset($item`Doc Clock's thyme cocktail`);
      drinksilent($item`Doc Clock's thyme cocktail`);
    }
  },
};

export const rolloverPrep: Task = {
  name: "Rollover Prep",
  completed: () =>
    myFamiliar() === $familiar`Trick-or-Treating Tot` &&
    equippedItem($slot`familiar`) === $item`li'l unicorn costume`,
  do: () => {
    if (myGardenType() !== "grass") {
      use(1, $item`packet of tall grass seeds`);
    }

    if (myGardenType() === "grass") {
      use($item`Poké-Gro fertilizer`);
      use($item`packet of thanksgarden seeds`);
    }
    if (!have($item`clockwork maid`) && getCampground()["clockwork maid"] !== 1)
      buy($item`clockwork maid`, 1, 10000);

    if (have($item`clockwork maid`)) {
      use($item`clockwork maid`);
    }

    if (ChateauMantegna.getCeiling() !== "artificial skylight")
      ChateauMantegna.changeCeiling("artificial skylight");

    if (eudoraItem() !== $item`New-You Club Membership Form`)
      visitUrl(`account.php?actions[]=whichpenpal&whichpenpal=4&action=Update`, true);

    useFamiliar($familiar`Trick-or-Treating Tot`);
    retrieveItem($item`li'l unicorn costume`);
    maximize(
      "adv +equip Spacegate scientist's insignia +equip Sasq™ watch -equip june cleaver",
      false
    );
    Clan.join("Alliance from Hobopolis");
  },
};
