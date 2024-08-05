import { Events, GameObjects, Math, Scene } from "phaser";
import { Bird } from "../Bird";
import { Pipe } from "../Pipe";
import { UI } from "../UI";

export class Main extends Scene {
    debugGraphics: Phaser.GameObjects.Graphics;
    score: number = 0
    speed: number = 20
    numberOfPipes: number = 5
    pipeOffset: Math.Vector2 = new Math.Vector2(300, 120)
    bird: Bird
    pipes: GameObjects.Container
    spacebar: Phaser.Input.Keyboard.Key
    rmb: Phaser.Input.Mouse.MouseManager
    ui: UI
    event_bus: Events.EventEmitter
    constructor() {
        super('Main')
    }
    preload() {
        const path = 'src/assets/FlappyBird/'
        this.load.image('bird', path + 'bird.png')
        this.load.json('bird-body', path + 'bird.json')
        this.load.image('pipe-top', path + 'pipe-top.png')
        this.load.image('pipe-bottom', path + 'pipe-bottom.png')
        this.event_bus = new Events.EventEmitter()
        this.ui = new UI(this, this.event_bus)
    }

    create() {
        let xBird = this.scale.width * 0.2
        let yBird = this.scale.height / 2

        let xPipes = this.scale.width * 0.5

        this.bird = new Bird(this, xBird, yBird)

        if (this.input.keyboard) {
            this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        }

        let barrier = this.matter.add.rectangle(-40, this.scale.height * 0.5, 30, this.scale.height, {
            label: 'barrier',
        })
        barrier.ignoreGravity = true

        this.matter.world.on("collisionactive", (e: any, a: any, b: any) => {
            console.log(a)
            console.log(b)
            if ((a.label == "checkpoint") || b.label == "checkpoint") {
                this.event_bus.emit('go-through', ++this.score)
                if (a.label == "checkpoint") {
                    a.destroy(true)
                }
                else if (b.label == "checkpoint") {
                    b.destroy(true)
                }
            }
            else if ((a.label == "bird") || b.label == "bird") {
                this.End()
            }
        })

        // Event
        this.event_bus.on('start-game', () => {
            this.score = 0
            this.ui.resetScore()
            this.bird.isAlive = true
            this.bird.setIgnoreGravity(false)
            this.bird.setPosition(xBird, yBird)
            this.bird.setVelocityY(0)
            if (this.pipes) this.pipes.destroy(true)
            this.pipes = this.add.container(0, 0)
            this.createNewPipes(xPipes)
        })

        this.event_bus.on('end-game', () => {
            this.ui.showTryAgain()
            this.deletePipes()
        })
        this.event_bus.on('go-through', (score: number) => {
            this.ui.updateScore(score)
        })
        // Debug
        this.debugGraphics = this.add.graphics().setAlpha(0.75);
        this.time.addEvent({
            delay: 1000 / 60,  // 60 FPS
            callback: this.drawDebug,
            callbackScope: this,
            loop: true
        });
    }
    drawDebug() {
        this.debugGraphics.clear();

        // Draw the collision shapes for each body
        this.matter.world.getAllBodies().forEach(body => {
            if (body.position) {
                this.debugGraphics.lineStyle(2, 0xff0000, 1);  // Red lines
                this.debugGraphics.beginPath();

                // Draw the body shapes
                body.vertices?.forEach((vertex, i) => {
                    if (i === 0) {
                        this.debugGraphics.moveTo(vertex.x, vertex.y);
                    } else {
                        this.debugGraphics.lineTo(vertex.x, vertex.y);
                    }
                });
                this.debugGraphics.closePath();
                this.debugGraphics.strokePath();
            }
        });
    }

    update(time: number, delta: number) {
        if (this.bird.isAlive) {
            if (this.bird.y > this.scale.height) {
                this.End()
            }
            this.bird.update(time, delta)
            if (this.spacebar.isDown || this.input.activePointer.leftButtonDown()) {
                this.bird.jump()
            }
            if (this.spacebar.isUp) {
                this.bird.release()
            }
            this.pipes.iterate((pipe: Pipe) => {
                pipe.move(this.speed * (delta / 100))
            });

            const flag = (this.pipes?.getAt(0) as Pipe)?.checkCollided()
            console.log(flag)
            if (flag) {
                var finalPipe = this.pipes.getAt(this.pipes.length - 1) as Pipe
                this.createNewPipes(finalPipe.getXPosition() + this.pipeOffset.x)
            }
        }
        else {

        }
    }

    createNewPipes(spawnX: number) {
        for (let i = 0; i < this.numberOfPipes; i++) {
            var rnd = Math.RND.between(-this.pipeOffset.y, this.pipeOffset.y)
            var x = spawnX + i * this.pipeOffset.x
            var pipe = new Pipe(this, x, rnd, this.scale.height)
            this.pipes.add(pipe)
        }
    }
    deletePipes() {
        for (let i = this.numberOfPipes; i >= 0; i--) {
            let pipe = this.pipes.getAt(i) as Pipe
            pipe?.destroyEverything()
            console.log(this.pipes.getAll())
        }
    }
    End() {
        console.log('end game')
        this.event_bus.emit('end-game')
        this.bird.isAlive = false
    }
}