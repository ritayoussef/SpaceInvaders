import Animation from '../../../../lib/Animation.js';
import State from '../../../../lib/State.js';
import Player from '../../../entities/Player.js';
import PlayerStateName from '../../../enums/PlayerStateName.js';
import { input, canvas } from '../../../globals.js';
import Input from '../../../../lib/Input.js';
import Direction from '../../../enums/Direction.js';

export default class PlayerMovingState extends State {
	constructor(player) {
		super();
		this.player = player;
		this.animation = {
			[Direction.Still]: new Animation([2, 7], 0.2),
			[Direction.Left]: new Animation([0, 5], 0.2),
			[Direction.Right]: new Animation([4, 9], 0.2),
		};
	}

	enter() {
		this.player.sprites = this.player.playerSprites;
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	update(dt) {
		if (input.isKeyHeld(Input.KEYS.SPACE)) {
			this.player.changeState(PlayerStateName.Shooting);
			return;
		}
		this.handleMovement(dt);

	}
	

	handleMovement(dt) {
		// Move left when "A" or "ArrowLeft" is held
		if (input.isKeyHeld(Input.KEYS.A) || input.isKeyHeld(Input.KEYS.ARROW_LEFT)) {
			this.player.direction = Direction.Left;
			this.player.position.x = Math.max(0, this.player.position.x - this.player.speed * dt);
		}
	
		// Move right when "D" or "ArrowRight" is held
		if (input.isKeyHeld(Input.KEYS.D) || input.isKeyHeld(Input.KEYS.ARROW_RIGHT)) {
			this.player.direction = Direction.Right;
			this.player.position.x = Math.min(
				canvas.width - this.player.dimensions.x,
				this.player.position.x + this.player.speed * dt
			);
		}
		if (
			!input.isKeyHeld(Input.KEYS.A) &&
			!input.isKeyHeld(Input.KEYS.D) &&
			!input.isKeyHeld(Input.KEYS.ARROW_LEFT) &&
			!input.isKeyHeld(Input.KEYS.ARROW_RIGHT) &&
			!input.isKeyHeld(Input.KEYS.SPACE)
		) {
			this.player.direction = Direction.Still;
			this.player.changeState(PlayerStateName.Idling);
		}
	}
	
	
}