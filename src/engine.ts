import { Engine, Task } from "grimoire-kolmafia";
import { setAutoAttack } from "kolmafia";

export class MannyEngine extends Engine<never, Task> {
  destruct(): void {
    super.destruct();
    setAutoAttack(0);
  }
}
