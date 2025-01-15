import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images, canvas, context, bullets, DEBUG, sounds } from "../globals.js";
import PlayerIdlingState from "../states/entity/player/PlayerIdlingState.js";
import PlayerShootingState from "../states/entity/player/PlayerShootingState.js";
import PlayerMovingState from "../states/entity/player/PlayerMovingState.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import GameEntity from "./GameEntity.js";
import StateMachine from "../../lib/StateMachine.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import Bullet from "./Bullet.js";
import SoundName from "../enums/SoundName.js";


export default class Player extends GameEntity {

	static TILE_WIDTH = 16;
	static TILE_HEIGHT = 24;
	static WIDTH = 16;
	static HEIGHT = 24;
	static MAX_SPEED = 300;
	static MAX_HEALTH = 30;
	static MAX_BULLETS = 50;
	static INVINCIBILITY_DURATION = 2;

	constructor() {
		super();

		this.playerSprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Player),
			Player.TILE_WIDTH,
			Player.TILE_HEIGHT
		);
		this.sprites = this.playerSprites;

		this.dimensions = new Vector(Player.WIDTH, Player.HEIGHT);
		this.position.x = 180;
		this.position.y = 180;
		this.speed = Player.MAX_SPEED;
		this.health = Player.MAX_HEALTH;
		this.bullets = Player.MAX_BULLETS;
		this.direction = Direction.Still;
		this.stateMachine = this.initializeStateMachine();
		this.invincibilityTimer = 0;
        this.isInvincible = false;
        this.opacity = 1;
        this.flashFrequency = 0.1; // Frequency of opacity toggling
        this.flashTimer = 0;
	}

	update(dt) {
        // Handle invincibility flashing
        if (this.isInvincible) {
            this.invincibilityTimer -= dt;

            // Toggle opacity for flashing effect
            this.flashTimer -= dt;
            if (this.flashTimer <= 0) {
                this.flashTimer = this.flashFrequency;
                this.opacity = this.opacity === 1 ? 0.5 : 1; // Toggle between full and half opacity
            }

            // End invincibility period
            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false;
                this.opacity = 1; // Restore full opacity
            }
        }

        // Update state machine and animations
        this.stateMachine.update(dt);
        if (this.currentAnimation) {
            this.currentAnimation.update(dt);
        }
		
    }
	

render() {
	context.save();
	context.globalAlpha = this.opacity; // Apply opacity for the player
	super.render(); // Use parent class rendering
	context.globalAlpha = 1; // Reset opacity for other entities
	context.restore();
	this.renderHitbox(context);
}

	
	initializeStateMachine() {
		const stateMachine = new StateMachine();

		stateMachine.add(PlayerStateName.Idling, new PlayerIdlingState(this));
		stateMachine.add(PlayerStateName.Moving, new PlayerMovingState(this));
		stateMachine.add(PlayerStateName.Shooting, new PlayerShootingState(this));

		stateMachine.change(PlayerStateName.Idling);
		return stateMachine;
	}
	reset() {
			this.health = Player.MAX_HEALTH;
			this.isDead = false;
			this.direction = Direction.Still;
			this.speed = 300;
			this.position = { x: 180, y: 180 };
			this.bullets = Player.MAX_BULLETS;
		}


	
	shootBullet() {
		const bulletX = this.position.x + this.dimensions.x / 2 - 2; // Center bullet horizontally
		if(this.bullets > 0){
			bullets.push(new Bullet(bulletX, this.position.y, this)); // Pass `this` as the source entity
			sounds.play(SoundName.Shooting);

			this.bullets = this.bullets - 1;
		}
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
	
	receiveDamage(damage) {
        if (!this.isInvincible) {
            this.health = Math.max(0, this.health - damage);
			sounds.play(SoundName.PlayerDamage);
            console.log(`Player received ${damage} damage. Health: ${this.health}`);
            
            // Trigger invincibility period
            this.isInvincible = true;
            this.invincibilityTimer = Player.INVINCIBILITY_DURATION;
            this.flashTimer = this.flashFrequency;

            if (this.health === 0) {
                this.isDead = true;
                console.log("Player is dead!");
            }
        }
    }
	
	didCollideWithEntity(entity) {
		if (this.isInvincible) return false;
		return (
			this.position.x < entity.x + entity.width &&
			this.position.x + this.dimensions.x > entity.x &&
			this.position.y < entity.y + entity.height &&
			this.position.y + this.dimensions.y > entity.y
		);
	}
	
	
}