export default class Food extends Phaser.GameObjects.Rectangle{
    total: number

    constructor(scene: Phaser.Scene, x: number, y: number, cellSize: number){
        super(scene, x * cellSize, y * cellSize, cellSize * 2, cellSize * 2, 0xFFC0CB)
        this.setOrigin(0)
        this.total = 0
        scene.children.add(this)
    }
    create(){
    }

    eat(){
        this.total++
    }
}