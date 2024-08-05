import Phaser, { Game } from "phaser"


const StartGame = (
    config: Phaser.Types.Core.GameConfig, 
    parent: string
) => {
    return new Game({ ...config, parent: parent})
}

export default StartGame