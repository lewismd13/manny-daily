import {
  adv1,
  availableChoiceOptions,
  cliExecute,
  handlingChoice,
  itemAmount,
  print,
  runChoice,
  setAutoAttack,
  setProperty,
  use,
  visitUrl,
} from "kolmafia";
import { $item, $location, $skill, Clan, get, have, Kmail, Macro } from "libram";

export function setChoice(adv: number, choice: number) {
  setProperty(`choiceAdventure${adv}`, `${choice}`);
}

export function bafhWls(): void {
  Clan.join("Bonus Adventures from Hell");

  const bafh = Clan.get();

  const inbox = Kmail.inbox();

  // TODO: force message to lowercase
  inbox.forEach((kmail) => {
    if (kmail.message.includes("whitelist bafh") || kmail.message.includes("Whitelist bafh")) {
      bafh.addPlayerToWhitelist(kmail.senderId);

      kmail.delete();
    }
  });

  setProperty("_bafhWlsDone", "1");

  Clan.join("Alliance From Hell");
}

function getChoiceOption(partialText: string): number {
  if (handlingChoice()) {
    const findResults = Object.entries(availableChoiceOptions()).find(
      (value) => value[1].indexOf(partialText) > -1
    );
    if (findResults) {
      return parseInt(findResults[0]);
    }
  }
  return -1;
}

export function breakfastCounter(): void {
  visitUrl("place.php?whichplace=monorail&action=monorail_downtown");

  const breakfast = getChoiceOption("Visit the Breakfast Counter");
  if (breakfast > 0) {
    runChoice(breakfast);
    const blueberry = getChoiceOption("Order a blueberry muffin");
    if (!have($item`blueberry muffin`) && blueberry > 0) {
      runChoice(blueberry);
    }
    const leaveCounter = getChoiceOption("Back to the Platform!");
    if (leaveCounter > 0) {
      runChoice(leaveCounter);
    }
  }
  const leaveStation = getChoiceOption("Nevermind");
  if (leaveStation > 0) {
    runChoice(leaveStation);
  }
  if (handlingChoice()) {
    throw "Failed to leave the monorail station!!";
  }
}

export function mannyQuestVolcoino() {
  visitUrl("place.php?whichplace=airport_hot&action=airport4_questhub");
  if (get("_volcanoItem1") === 8523) {
    if (
      !get("_claraBellUsed") &&
      itemAmount($item`fused fuse`) === 0 &&
      get("_questPartyFairQuest") !== "food" &&
      get("_questPartyFairQuest") !== "booze"
    ) {
      use($item`Clara's bell`);
      setChoice(1091, 7);
      Macro.skill($skill`Saucestorm`)
        .repeat()
        .setAutoAttack();
      while (itemAmount($item`fused fuse`) === 0) {
        adv1($location`LavaCo™ Lamp Factory`, -1, "");
      }
      visitUrl("place.php?whichplace=airport_hot&action=airport4_questhub");
      runChoice(1);
    } else if (!get("_freePillKeeperUsed")) {
      cliExecute("pillkeeper free noncombat");
      setChoice(1091, 7);
      Macro.skill($skill`Saucestorm`)
        .repeat()
        .setAutoAttack();
      while (itemAmount($item`fused fuse`) === 0) {
        adv1($location`LavaCo™ Lamp Factory`, -1, "");
      }
      visitUrl("place.php?whichplace=airport_hot&action=airport4_questhub");
      runChoice(1);
    } else {
      print("You need a fused fuse but can't force a NC for free. :(", "red");
    }
    setAutoAttack(0);
  }
}
