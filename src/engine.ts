import { Engine, Task } from "grimoire-kolmafia";
import { setAutoAttack } from "kolmafia";
import { Clan } from "libram";

export class MannyEngine extends Engine<never, Task> {
  destruct(): void {
    super.destruct();
    setAutoAttack(0);
    Clan.join("Alliance From Hell");
  }
}
