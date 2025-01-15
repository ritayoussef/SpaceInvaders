import Animation from '../../../../lib/Animation.js';
import State from '../../../../lib/State.js';
import Player from '../../../entities/Player.js';
import PlayerStateName from '../../../enums/PlayerStateName.js';
import Direction from '../../../enums/Direction.js';
import { input } from '../../../globals.js';
import Input from '../../../../lib/Input.js';

export default class PlayerIdlingState extends State {
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
		// Check for movement and transition to the moving state
		this.checkForMovement();

		// Check if the space key is pressed to transition to shooting state
		if (input.isKeyHeld(Input.KEYS.SPACE)) {
			this.player.changeState(PlayerStateName.Shooting);
		//	return;
		}

		// If no keys are being pressed, stay in the idle state
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

	checkForMovement() {
		if (input.isKeyHeld(Input.KEYS.A) || input.isKeyHeld(Input.KEYS.ARROW_LEFT)) {
			this.player.direction = Direction.Left;
			this.player.changeState(PlayerStateName.Moving);
		} else if (input.isKeyHeld(Input.KEYS.D) || input.isKeyHeld(Input.KEYS.ARROW_RIGHT)) {
			this.player.direction = Direction.Right;
			this.player.changeState(PlayerStateName.Moving);
		}
	}
	
}