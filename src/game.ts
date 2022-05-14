import { defineComponent as vueDefineComponent, createApp as vueCreateApp, App as vueApp, reactive, ref as vueRef, Ref as vueRefCls, PropType as vuePropType, toRef as toVueRef, toRefs as toVueRefs, computed as vueComputed } from "vue"

import "phaser"
import { createControllerScene, Controller } from "./controller"

import GameUI from "./components/GameUI.vue"

class GameScene extends Phaser.Scene {

    controller: Controller;
    player: Phaser.GameObjects.GameObject;
    scrollObjects: Phaser.GameObjects.Group;
    timer: number;

    ui: vueApp<Element>;

    is_gameover: vueRefCls<boolean>;
    score: vueRefCls<number>;

    constructor() {
        super({
            key: GameScene.name,
            active: false
        });
    }

    explosion(x, y, color, cnt, velocity) {
        let obj: Phaser.GameObjects.Rectangle;


        for (let i = 0; i < cnt; i++) {
            obj = this.add.rectangle(x, y, 16, 16, color);

            this.physics.add.existing(obj, false);
            let r = 2 * Math.PI * Math.random();
            (obj.body as Phaser.Physics.Arcade.Body).setVelocity(velocity * Math.cos(r), velocity * Math.sin(r)).setAllowGravity(true);

            this.time.delayedCall(60, () => { obj.destroy(); obj.destroy(); });
        }
    }

    missPlayer() {
        this.is_gameover.value = true;
        let x, y;
        x = this.player.body.position.x;
        y = this.player.body.position.y;
        if (y > this.scale.height - 16) y = this.scale.height - 16;
        this.explosion(x, y, 0x6666ff, 15, 400);
        this.explosion(x, y, 0x6666ff, 15, 200);
        this.player.destroy();
    }

    summonEnemy(y) {
        let obj;

        obj = this.add.rectangle(this.scale.width + 32, y, 32, 32, 0xff3333);
        this.physics.add.existing(obj, false);
        (obj.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
        this.scrollObjects.add(obj);

        this.physics.add.collider(this.player, obj, this.missPlayer.bind(this));
    }

    init(): void {
        this.events.on('shutdown', this.onshutdown.bind(this));
    }

    preload(): void {

    }

    create(): void {

        this.scrollObjects = this.add.group();

        /* backgnd */
        let backgnd = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0xffffff);
        backgnd.setDepth(-100);

        /* game */
        this.player = this.add.rectangle(100, 150, 32, 32, 0x6666ff)
        this.physics.add.existing(this.player, false);
        (this.player.body as Phaser.Physics.Arcade.Body).setBounce(0, 1.0).setVelocityX(0);

        let obj: Phaser.GameObjects.GameObject;

        obj = this.add.rectangle(100, this.scale.height, 400, 30, 0x6666ff);
        this.physics.add.existing(obj);
        (obj.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setImmovable(true).setFriction(0, 0);;
        this.physics.add.collider(this.player, obj);
        this.scrollObjects.add(obj);

        obj = this.add.rectangle(this.scale.width / 2, -15, this.scale.width, 30, 0x6666ff);
        this.physics.add.existing(obj);
        (obj.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setImmovable(true);
        this.physics.add.collider(this.player, obj);

        /* Enemy */

        this.summonEnemy(Math.random() * this.scale.height);

        /* camera */


        /* input */
        this.controller = this.scene.get(Controller.name) as Controller;
        this.scene.launch(this.controller);

        /* variables */
        this.score = vueRef(0);
        this.timer = 0;
        this.is_gameover = vueRef(false);

        /* ui */
        let this_game = this;
        this.ui = vueCreateApp({
            props: {
            },
            setup(props, context) {
                return {
                    is_gameover: this_game.is_gameover,
                    score: this_game.score,
                    restart_func: this_game.reset.bind(this_game)
                };
            }
        });
        this.ui.component("hoge", GameUI);
        document.getElementById("contents-ui").innerHTML = '<hoge v-bind:score="score" v-bind:is_gameover="is_gameover" v-bind:restart_func="restart_func"></hoge>'
        this.ui.mount("#contents-ui");
    }


    reset() {
        this.scene.restart();
    }


    update(time: number, delta: number): void {
        this.timer++;

        /* プレイヤー操作 */
        if (this.is_gameover.value) {

        }
        else {
            this.score.value += 1;

            if (this.controller.hasJumpInput) {
                let pl = (this.player.body as Phaser.Physics.Arcade.Body);
                pl.setVelocityY(pl.velocity.y - 25);
            }
            if (this.player.body.position.y >= this.scale.height + 64) {
                this.missPlayer();
            }
        }

        /* 敵追加 */
        if ((this.timer % 120) === 0) {
            this.summonEnemy(Math.random() * this.scale.height);
        }

        for (let obj of this.scrollObjects.getChildren()) {
            let body = (obj.body as Phaser.Physics.Arcade.Body);
            body.setVelocityX(-100);
            if (body.position.x <= -body.width) {
                this.scrollObjects.remove(obj);
                obj.destroy();
            }
        }
    }


    onshutdown() {
        if (this.ui) this.ui.unmount();
    }
}



// ゲームメインのクラス
class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

export function gameStart(check = null) {

    const config: Phaser.Types.Core.GameConfig = {
        title: "popball",
        version: "0.1.0",
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            parent: "contents",
            width: 720,
            height: 480,
        },
        fps: {
            target: 60,
            forceSetTimeOut: false,
        },
        render: {
            roundPixels: true,
            pixelArt: true,
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 500 }
            },
        },
        type: Phaser.AUTO,
        scene: [GameScene, createControllerScene(check)]
    }

    var game = new Game(config);
    game.scene.start(GameScene.name)

    let canvas = document.getElementById("contents").getElementsByTagName("canvas")[0];
    let ui = document.getElementById("contents-ui");

    game.scale.addListener("resize", () => {
        ui.style.width = canvas.style.width;
        ui.style.height = canvas.style.height;
        ui.style.margin = canvas.style.margin;
        ui.style.marginLeft = canvas.style.marginLeft;
        ui.style.marginTop = canvas.style.marginTop;
        ui.style.padding = canvas.style.padding;
        ui.style.border = canvas.style.border;
        ui.style.verticalAlign = canvas.style.verticalAlign;
    })
}
