import "phaser";

export class Controller extends Phaser.Scene {

  keySpace: Phaser.Input.Keyboard.Key;

  constructor(create = null, check = null) {
    super({
      key: Controller.name,
      active: false,
    })
  }

  create(): void {
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  get hasJumpInput(): boolean {
    return this.keySpace.isDown;
  }
}




export function createControllerScene(check=null):typeof Controller{
  if (check == null){
    return Controller;
  }

  class OriginalController extends Controller {
  
    constructor(create = null, check = null) {
      super({
        key: Controller.name,
        active: false,
      })
    }
  
    create(): void {
    }
  
    get hasJumpInput(): boolean {
      return check();
    }
  }

  return OriginalController;
}
