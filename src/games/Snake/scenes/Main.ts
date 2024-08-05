import { Events, Scene } from "phaser";
import Snake from "../Snake";
import Food from "../Food";
import { UI } from "./UI";

export class Main extends Scene {
    gameStart: boolean = false
    cellSize: number = 16
    event_bus: Events.EventEmitter

    width: number
    height: number
    totalXCell: number
    totalYCell: number

    snake: Snake
    food: Food
    ui: UI
    cursors: Phaser.Types.Input.Keyboard.CursorKeys
    wasd: any
    score: number = 0
    constructor() {
        super('Main')
    }
    preload() {
        const canvas = this.sys.game.canvas
        this.width = canvas.width
        this.height = canvas.height
        this.totalXCell = this.width / this.cellSize
        this.totalYCell = this.height / this.cellSize
        this.event_bus = new Events.EventEmitter()
        this.ui = new UI(this, this.event_bus)
    }

    create() {
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys()
            this.wasd = {
                up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
            };
        }
        this.event_bus.on('food-eat', (score: number) => {
            this.ui.updateScore(score)
        })
        this.event_bus.on('start-game', () => {
            this.score = 0
            this.ui.resetScore()
            this.snake = new Snake(this, 8, 8, this.cellSize, this.totalXCell, this.totalYCell)
            this.food = new Food(this, 15, 8, this.cellSize)
            this.gameStart = true
        })
        this.event_bus.on('lose-game', () => {
            console.log('end game')
            this.gameStart = false
            this.snake.destroy()
            this.food.destroy(true)
            this.ui.showTryAgain()
        })
    }

    update(time: any, delta: any) {
        if (this.gameStart) {
            console.log(this.snake.alive)
            if (!this.snake.alive) {
                this.event_bus.emit('lose-game')
                return
            }

            if (this.wasd.left.isDown || this.cursors.left.isDown) {
                this.snake.faceLeft()
            }

            else if (this.wasd.right.isDown || this.cursors.right.isDown) {
                this.snake.faceRight()
            }

            else if (this.wasd.up.isDown || this.cursors.up.isDown) {
                this.snake.faceUp()
            }

            else if (this.wasd.down.isDown || this.cursors.down.isDown) {
                this.snake.faceDown()
            }

            if (this.snake.update(time)) {
                if (this.snake.collideWithFood(this.food)) {
                    this.event_bus.emit('food-eat', ++this.score)
                    this.repositionFood();
                }
            }
        }
    }

    repositionFood() {
        var grid: any = []
        for (var y = 0; y < this.totalYCell; y++) {
            grid[y] = [];

            for (var x = 0; x < this.totalXCell; x++) {
                grid[y][x] = true;
            }
        }
        var validLoc: any = []

        for (var y = 0; y < this.totalYCell; y++) {
            for (var x = 0; x < this.totalXCell; x++) {
                if (grid[y][x] === true) {
                    validLoc.push({ x: x, y: y })
                }
            }
        }

        if (validLoc.length > 0) {
            var pos: any = Phaser.Math.RND.pick(validLoc)

            this.food.setPosition(pos.x * this.cellSize, pos.y * this.cellSize)
        }
    }
}