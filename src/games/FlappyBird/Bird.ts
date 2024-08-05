import { Scene, Types } from "phaser";

export class Bird extends Phaser.Physics.Matter.Sprite {
    maxRotation: number = 60
    rotationSpeed: number = 0.03
    isJumping: boolean = false
    jumpStrength: number = 7
    isAlive = false
    constructor(scene: Scene, x: number, y: number) {
        let body = scene.cache.json.get('bird-body')
        super(scene.matter.world, x, y, 'bird', '',{
            label: 'bird',
            shape: body,
            isSensor: true,
        })
        this.setIgnoreGravity(true)
        this.setName("Bird")
        this.setScale(1.5,1.5)
        scene.add.existing(this)
        this.setBounce(1)
    }
    update(time: number, delta: number) {
        if (this.body) {
            const velocityY = this.body.velocity.y
            const rotation = Phaser.Math.Clamp(velocityY, -1, 1) * Phaser.Math.DegToRad(this.maxRotation)
            const shortest = Phaser.Math.Angle.ShortestBetween(this.rotation, rotation)
            this.rotation = Phaser.Math.Angle.Wrap(this.rotation + shortest * this.rotationSpeed)
        }
    }

    jump(){
        if(!this.isJumping){
            this.isJumping = true
            this.setVelocityY(-this.jumpStrength)
        }
    }
    release(){
        this.isJumping = false
    }

    die(){

    }

}