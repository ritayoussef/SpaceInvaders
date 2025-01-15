import Animation from '../../../../lib/Animation.js';
import State from '../../../../lib/State.js';
import Player from '../../../entities/Player.js';
import PlayerStateName from '../../../enums/PlayerStateName.js';
import Bullet from '../../../entities/Bullet.js';
import Input from '../../../../lib/Input.js';
import { input, bullets, context } from '../../../globals.js';
import Direction from '../../../enums/Direction.js';

export default class PlayerShootingState extends State {
	constructor(player) {
		super();
		this.player = player;

		// Shooting animation
		this.animation = new Animation([0, 1, 2, 3, 4], 0.5, 1);

		// Cooldown for continuous shooting
		this.shootCooldown = 0.2; 
		this.timeSinceLastShot = 0;
	}

	enter() {
		// Set shooting animation
		this.player.currentAnimation = this.animation;

		// Reset the cooldown timer
		this.timeSinceLastShot = this.shootCooldown;
	}

	update(dt) {
		// Update the cooldown timer
		this.timeSinceLastShot -= dt;

		// Shoot only if the cooldown timer is complete
		if (this.timeSinceLastShot <= 0) {
			this.player.shootBullet(); 
			this.timeSinceLastShot = this.shootCooldown; 
		}

		// Transition back to idle or moving state if the space key is not held
		if (!input.isKeyHeld(Input.KEYS.SPACE)) {
			this.player.changeState(PlayerStateName.Idling);
		}
	}

	shootBullet() {
		// Determine bullet starting position based on player direction
		let bulletX = this.player.position.x + this.player.dimensions.x / 2 - 2; 
	
		// Add new bullet to the bullets array
		if(this.player.bullets > 0){
			bullets.push(new Bullet(bulletX, this.player.position.y - 5)); 
			this.player.bullets = this.player.bullets - 1;
		}
	}
}  
