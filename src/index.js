
import Phaser from "phaser"
import PreloadScene from "./scene/PreloadScene"
import PlayScene from "./scene/PlayScene"
import MenuScene from "./scene/MenuScene"
import ScoreScene from "./scene/ScoreScene"
import PauseScene from "./scene/PauseScene"

const WIDTH = 800
const HEIGHT = 600
const BIRD_POSITION = { x: WIDTH * 0.1, y: HEIGHT / 2 }

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}

const Scenes = [ PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene]
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: initScenes()
}

new Phaser.Game(config);