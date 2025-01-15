import { getRandomPositiveInteger } from '../../../lib/Random.js';
import StateMachine from '../../../lib/StateMachine.js';
import Direction from '../../enums/Direction.js';
import EnemyStateName from '../../enums/EnemyStateName.js';
import SoundName from '../../enums/SoundName.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, bullets, DEBUG, powerUps, sounds } from '../../globals.js';
import EnemyIdlingState from '../../states/entity/enemy/EnemyIdlingState.js';
import EnemyMovingState from '../../states/entity/enemy/EnemyMovingState.js';
import EnemyShootingState from '../../states/entity/enemy/EnemyShootingState.js';
import GameEntity from '../GameEntity.js';
import Bullet from '../Bullet.js';
import PowerUp from '../PowerUp.js';


export default class Enemy extends GameEntity {
	static WIDTH = 16;
	static HEIGHT = 16;

	/**
	 * The enemy characters in the game that randomly
	 * walk around the room and can damage the player.
	 */
	constructor(sprites, enemyWidth, enemyHeight) {
		super();

		this.sprites = sprites;
		this.position.x = getRandomPositiveInteger(
			CANVAS_WIDTH - CANVAS_WIDTH,
			CANVAS_WIDTH
		);
		this.position.y = getRandomPositiveInteger(
			CANVAS_HEIGHT - CANVAS_HEIGHT,
			CANVAS_HEIGHT / 4
		);
		this.dimensions.x = enemyWidth;
		this.dimensions.y = enemyHeight;
		this.direction = Direction.Still;
		this.isDead = false;
		this.markedForRemoval = false;
	}
	
	receiveDamage() {
		if (!this.isDead) {
			// this.isDead = true;
			// this.markedForRemoval = true; // Mark enemy for removal
			this.health -= 1;
			sounds.play(SoundName.AlienDamage);
			if(this.health == 0){
				this.isDead = true;
				this.markedForRemoval = true;
				let dropPowerUp = Math.round(Math.random() * 1) === 1;
				if(dropPowerUp){
					powerUps.push(new PowerUp(this.position.x, this.position.y))
				}
			}
		}
	}
	
	shootBullet() {
		const bulletX = this.position.x + this.dimensions.x / 2 - 2; 
		bullets.push(new Bullet(bulletX, this.position.y + this.dimensions.y, this)); 
	}
	
	update(dt) {
		// Handle state updates
		this.stateMachine.update(dt);
	
		// Update player's current animation
		if (this.currentAnimation) {
			this.currentAnimation.update(dt);
		}
	}
	didCollideWithEntity(entity) {
		return (
			this.position.x < entity.x + entity.width &&
			this.position.x + this.dimensions.x > entity.x &&
			this.position.y < entity.y + entity.height &&
			this.position.y + this.dimensions.y > entity.y
		);
	}
	
	render() {
		// Get the current frame index for the animation
		const currentFrame = this.currentAnimation ? this.currentAnimation.getCurrentFrame() : 0;
	
		// Validate the sprite and current frame
		if (!this.sprites || !this.sprites[currentFrame]) {
			console.error("No sprite or invalid frame:", this.sprites, currentFrame);
			return;
		}
	
		const sprite = this.sprites[currentFrame];
	
		// Draw the sprite at the enemy's current position
		context.drawImage(
			sprite.graphic.image,       // The sprite sheet image
			sprite.x,                   // X position in the sprite sheet
			sprite.y,                   // Y position in the sprite sheet
			sprite.width,               // Width of the sprite in the sprite sheet
			sprite.height,              // Height of the sprite in the sprite sheet
			this.position.x,            // X position on the canvas
			this.position.y,            // Y position on the canvas
			sprite.width,               // Render width of the sprite
			sprite.height               // Render height of the sprite
		);
	
		// Call renderHitbox for debugging
		this.renderHitbox(context);
	}
	renderHitbox(context) {
		if (DEBUG) { 
			context.strokeStyle = 'red';
			context.strokeRect(
				this.position.x,
				this.position.y,
				this.dimensions.x,
				this.dimensions.y
			);
		}
	}
	
	initializeStateMachine(animations) {
		const stateMachine = new StateMachine();

		stateMachine.add(
			EnemyStateName.Idle,
			new EnemyIdlingState(this, animations[EnemyStateName.Idle])
		);
		stateMachine.add(
			EnemyStateName.Moving,
			new EnemyMovingState(this, animations[EnemyStateName.Moving])
		);
		stateMachine.add(
			EnemyStateName.Shooting,
			new EnemyShootingState(this, animations[EnemyStateName.Shooting])
		);

		stateMachine.change(EnemyStateName.Idle);

		return stateMachine;
	}
}
