import StateMachine from './StateMachine.js';
import { bullets, input , stateMachine, images} from '../src/globals.js';
import Input from './Input.js';
import Health from '../src/entities/Health.js';
import Player from '../src/entities/Player.js';
import GameStateName from '../src/enums/GameStateName.js';
import TitleScreenState from '../src/states/TitleScreenState.js';
import PlayState from '../src/states/PlayState.js';
import Sprite from './Sprite.js';
import ImageName from '../src/enums/ImageName.js';
import Enemy from '../src/entities/enemies/Enemy.js';
import GameOverState from '../src/states/GameOverState.js';
import VictoryState from '../src/states/VictoryState.js';
export default class Game {
	constructor(stateMachine, context, timer, width, height) {
		this.stateMachine = stateMachine;
		this.context = context;
		this.timer = timer;
		this.width = width;
		this.height = height;
		this.lastTime = 0;		
		this.enemies = []; 
		
	 
	}

	start() {
		this.gameLoop();
	}

	gameLoop(currentTime = 0) {
		const deltaTime = (currentTime - this.lastTime) / 1000;	
		// Update and render the game state
		this.update(deltaTime);
		this.lastTime = currentTime;
		requestAnimationFrame((time) => this.gameLoop(time));
	}
	
	
	
	update(dt) {
		//this.timer.update(dt);
		this.stateMachine.update(dt);
		this.render();
	
	}

	render() {
		this.context.clearRect(0, 0, this.width, this.height);

		// Render the game state
		this.stateMachine.render();
	}
}
