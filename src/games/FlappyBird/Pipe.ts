import { GameObjects, Math, Scene } from "phaser";

export class Pipe extends GameObjects.Container {
    top: Phaser.Physics.Matter.Sprite
    bottom: Phaser.Physics.Matter.Sprite
    checkpoint: Phaser.Physics.Matter.Sprite
    isCollide: boolean
    constructor(scene: Scene, x: number, y: number, height: number) {
        super(scene, 0, 0)
        var bird = this.scene.children.getByName('Bird')
        this.top = scene.matter.add.sprite(x, 80 + y, 'pipe-top', '', {
            label: 'pipe',
            vertices: [
                {
                    "x": 8.049964904785156,
                    "y": 0.6250839233398438
                },
                {
                    "x": 58.674957275390625,
                    "y": -0.72491455078125
                },
                {
                    "x": 57.94997787475586,
                    "y": 390.4501037597656
                },
                {
                    "x": 64.5999755859375,
                    "y": 393.30010986328125
                },
                {
                    "x": 64.5999755859375,
                    "y": 411.35009765625
                },
                {
                    "x": 0.9499921798706055,
                    "y": 410.40008544921875
                },
                {
                    "x": -0.9500083923339844,
                    "y": 394.2500915527344
                },
                {
                    "x": 3.999995231628418,
                    "y": 388.7500915527344
                }
            ],
            isSensor: true,
            isStatic: true
        })
        this.bottom = scene.matter.add.sprite(x, height + y - 80, 'pipe-bottom', '', {
            label: 'pipe',
            vertices: [
                {
                    "x": 0.24994659423828125,
                    "y": 557.50048828125
                },
                {
                    "x": 0.24994659423828125,
                    "y": 575.6504516601562
                },
                {
                    "x": 5.749950408935547,
                    "y": 577.3004760742188
                },
                {
                    "x": 4.649951934814453,
                    "y": 970.5504150390625
                },
                {
                    "x": 59.09994125366211,
                    "y": 972.200439453125
                },
                {
                    "x": 59.64994812011719,
                    "y": 577.30029296875
                },
                {
                    "x": 65.14995574951172,
                    "y": 578.4003295898438
                },
                {
                    "x": 63.49995422363281,
                    "y": 556.4003295898438
                }
            ],
            isSensor: true,
            isStatic: true
        })
        this.checkpoint = scene.matter.add.sprite(x, height / 2 + y, '', '', {
            label: 'checkpoint',
            vertices: [
                {
                    "x": 0,
                    "y": -50
                },
                {
                    "x": 25,
                    "y": -50
                },
                {
                    "x": 25,
                    "y": 50
                },
                {
                    "x": 0,
                    "y": 50
                }
            ],
            isSensor: true,
            isStatic: true,
        })
        this.checkpoint.alpha = 0
        console.log(this.checkpoint.body?.gameObject)
        if (bird) {
            this.top.setOnCollide((e: Phaser.Types.Physics.Matter.MatterCollisionData) => {
                if (e.bodyA.label == 'barrier' || e.bodyB.label == 'barrier') {
                    this.isCollide = true
                }
            })
            this.bottom.setOnCollide((e: Phaser.Types.Physics.Matter.MatterCollisionData) => {
                if (e.bodyA.label == 'barrier' || e.bodyB.label == 'barrier') {
                    this.isCollide = true
                }
            })
        }
        this.add(this.top)
        this.add(this.bottom)
        this.scene.add.existing(this)
    }
    move(speed: number) {
        this.top.x -= speed
        this.bottom.x -= speed
        this.checkpoint.x -= speed
    }
    checkCollided() {
        if (this.isCollide) {
            this.checkpoint.destroy(true)
            this.destroy(true)
            return true
        }
        return false
    }

    getXPosition() {
        return this.bottom.x
    }
    destroyEverything(){
        this.checkpoint?.destroy(true)
        this.destroy(true)
    }
}