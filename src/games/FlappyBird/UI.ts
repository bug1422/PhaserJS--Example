import { Events, Scene } from "phaser"

export class UI {
    scene: Scene
    menu: Phaser.GameObjects.Container
    tryagain: Phaser.GameObjects.Container
    scoreText: Phaser.GameObjects.Text
    event: Events.EventEmitter
    constructor(scene: Scene, event: Events.EventEmitter) {
        this.scene = scene
        this.event = event
        this.scoreText = this.scene.add.text(0, 0, '0 Point', {
            fontSize: '32px',
            color: '#fff',
            align: 'left'
        }).setOrigin(0)
        const canvas = this.scene.sys.game.canvas
        let width = canvas.width
        let height = canvas.height
        this.createUI(width, height)
        this.createTryAgain(width, height)
    }
    
    resetScore(){
        this.scoreText.setText(`0 Point`)
    }
    
    createTryAgain(width: number, height: number) {

        this.tryagain = this.scene.add.container(width * 0.125, height * 0.125)
        let bgWidth = width * 0.75
        let bgHeight = height * 0.75
        let background = this.scene.add.rectangle(0, 0, bgWidth, bgHeight, 0x0000ff, 0.5)
        background.setOrigin(0)
        var title = this.scene.add.text(0, 0, 'Game Over', {
            fontSize: '64px',
            color: '#fff',
            align: 'center',
            fixedWidth: bgWidth,
            padding: {
                top: 20
            }
        })
        var button = this.scene.add.rectangle(bgWidth * 0.5, bgHeight * 0.4, bgWidth * 0.65, 64, 0xfffa91)

        button.setInteractive()
        button.on("pointerover", () => {
            button.setStrokeStyle(4, 0xefc53f)
        })
        button.on("pointerout", () => {
            button.setStrokeStyle(0)
        })
        button.on("pointerdown", () => {
            this.tryagain.visible = false
            this.event.emit('start-game')
        })
        var playText = this.scene.add.text(72, button.y - 20, 'TRY AGAIN', {
            fontSize: '48px',
            color: '#ffffff',
            fixedWidth: button.width,
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        })
        this.tryagain.visible = false
        this.tryagain.add([background, title, button, playText])
    }

    createUI(width: number, height: number) {
        this.menu = this.scene.add.container(width * 0.125, height * 0.125)

        let bgWidth = width * 0.75
        let bgHeight = height * 0.75
        let background = this.scene.add.rectangle(0, 0, bgWidth, bgHeight, 0x0000ff, 0.5)
        background.setOrigin(0)
        var title = this.scene.add.text(0, 0, 'Flappy bird', {
            fontSize: '64px',
            color: '#fff',
            align: 'center',
            fixedWidth: bgWidth,
            padding: {
                top: 20
            }
        })
        var button = this.scene.add.rectangle(bgWidth * 0.5, bgHeight * 0.4, bgWidth * 0.65, 64, 0xfffa91)

        button.setInteractive()
        button.on("pointerover", () => {
            button.setStrokeStyle(4, 0xefc53f)
        })
        button.on("pointerout", () => {
            button.setStrokeStyle(0)
        })
        button.on("pointerdown", () => {
            this.menu.visible = false
            this.event.emit('start-game')
        })

        var playText = this.scene.add.text(0, button.y - 20, 'PLAY', {
            fontSize: '48px',
            color: '#ffffff',
            fixedWidth: button.width,
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        })

        var tipsText = this.scene.add.text(10, 20, 'use SPACEBAR to hop')

        this.menu.add([background, title, button, playText,tipsText])
        this.menu.depth = 999
    }

    updateScore(score: number) {
        this.scoreText.setText(`${score} Point`)
    }

    showTryAgain() {
        this.tryagain.visible = true
    }
}