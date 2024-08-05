import { DOWN, LEFT, RIGHT, Scene, UP } from "phaser"

export default class Snake {
    scene: Scene = null!
    body: Phaser.GameObjects.Group
    updated: boolean
    alive: boolean
    moveTime: number
    intervalTime: number = 100
    head: any
    tail: any
    direction: number
    heading: number
    headPosition: Phaser.Geom.Point

    totalXCell : number
    totalYCell : number
    cellSize : number

    constructor(scene: Scene,x: number, y: number, cellSize: number, totalXCell: number, totalYCell: number) {
        this.cellSize = cellSize
        this.body = scene.add.group()
        this.totalXCell = totalXCell
        this.totalYCell = totalYCell
        this.headPosition = new Phaser.Geom.Point(x, y)
        this.head = this.body.create(x * this.cellSize / 2, y * this.cellSize / 2, 'body')
        this.head.setOrigin(0)
        this.head.setTintFill(0xffffff)

        this.alive = true
        this.moveTime = 0
        this.tail = new Phaser.Geom.Point(x, y)

        this.heading = RIGHT
        this.direction = RIGHT
    }

    update(time: number): boolean {
        if (time > this.moveTime + this.intervalTime) {
            return this.move(time)
        }
        return true
    }

    faceLeft() {
        if (this.direction === UP || this.direction === DOWN) {
            this.heading = LEFT
        }
    }

    faceRight() {
        if (this.direction === UP || this.direction === DOWN) {
            this.heading = RIGHT
        }
    }

    faceUp() {
        if (this.direction === LEFT || this.direction === RIGHT) {
            this.heading = UP
        }
    }

    faceDown() {
        if (this.direction === LEFT || this.direction === RIGHT) {
            this.heading = DOWN
        }
    }

    move(time: any): boolean {
        switch (this.heading) {
            case LEFT:
                this.headPosition.x = this.headPosition.x - 1
                break
            case RIGHT:
                this.headPosition.x = this.headPosition.x + 1
                break
            case UP:
                this.headPosition.y = this.headPosition.y - 1
                break
            case DOWN:
                this.headPosition.y = this.headPosition.y + 1
                break
        }
        if(this.headPosition.x < 0 || this.headPosition.x >= this.totalXCell - 1 || this.headPosition.y < 0 || this.headPosition.y >= this.totalYCell - 1){
            this.alive = false
            return false
        }
        this.direction = this.heading
        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * this.cellSize, this.headPosition.y * this.cellSize, 1, this.tail)

        var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1)
        if(hitBody){
            this.alive = false
            return false
        }
        else{
            this.moveTime = time 
            return true
        }
    }
    destroy(){
        this.body.children.each((segment: any) => {
            segment.destroy(true)
            return null
        })
    }

    grow(){
        var newPart = this.body.create(this.tail.x,this.tail.y, 'body')
        newPart.setTintFill(0xffffff)
        newPart.setOrigin(0)
    }

    collideWithFood(food: any){
        if (Math.abs(this.head.x - food.x) <= this.cellSize && Math.abs(this.head.y - food.y) <= this.cellSize){
            this.grow()

            food.eat()

            return true
        }
        else return false
    }

    updateGrid(grid: any){
        this.body.children.each((segment: any) => {
            var bx = segment.x / this.cellSize
            var by = segment.y / this.cellSize
            grid[by][bx] = false
            return null
        })
        return grid
    }
}
