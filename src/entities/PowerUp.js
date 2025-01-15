import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images, context, CANVAS_HEIGHT, DEBUG, sounds } from "../globals.js";
import GameEntity from "./GameEntity.js";
import Animation from "../../lib/Animation.js";
import Player from "./Player.js";
import SoundName from "../enums/SoundName.js";

export default class PowerUp extends GameEntity {
	static TILE_WIDTH = 16;
	static TILE_HEIGHT = 16;
	static WIDTH = 16; 
	static HEIGHT = 16; 
	static SPEED = 50; 

	constructor(x, y) {
		super();
		this.x = x;
		this.y = y;
		this.width = PowerUp.WIDTH;
		this.height = PowerUp.HEIGHT;

		// Generate sprites from the sprite sheet
		this.PowerUpSprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.PowerUp),
			PowerUp.TILE_WIDTH,
			PowerUp.TILE_HEIGHT
		);

		// Animation setup
		this.shootingAnimation = new Animation([0, 1, 2, 3], 0.5); 
		this.isShooting = true;
		this.isCollideWithEnemy = false;
		this.dimensions.x = PowerUp.WIDTH;
		this.dimensions.y = PowerUp.HEIGHT;
		this.sprites = this.PowerUpSprites;
	}

	update(dt, entities) {
		// Update animation
		if(entities.didCollideWithEntity(this)){
			this.checkForEnemyCollision(entities);
		}
			

		// Move the power up downward
			this.y += PowerUp.SPEED * dt;
		// Remove the powerup if it goes off-screen
		if (this.y > CANVAS_HEIGHT) {
			this.markedForRemoval = true;
		}
	}
    
	checkForEnemyCollision(entity) {
		if (entity instanceof Player) {
			const powerUpType = Math.round(Math.random());
			if (powerUpType === 1) {
				// Heal the player
				if (entity.health < Player.MAX_HEALTH) {
					entity.health = Math.min(Player.MAX_HEALTH, entity.health + 1);
					
				}
			} else if (powerUpType === 0) {
				// Replenish bullets
				if (entity.bullets < Player.MAX_BULLETS) {
					entity.bullets = Math.min(Player.MAX_BULLETS, entity.bullets + 5);
					
				}
			}
			sounds.play(SoundName.Powerup);
	
			this.markedForRemoval = true; // Mark power-up for removal after use
		}
	}
	

	render() {
		// Validate if sprites array exists and has at least one sprite
		if (!this.sprites || this.sprites.length === 0) {
			console.error("Bullet sprites are not defined or empty:", this.sprites);
			return;
		}

		// Get the current frame of the animation
		const currentFrame = this.shootingAnimation.getCurrentFrame();
		const sprite = this.sprites[currentFrame];

		// Draw the current frame of the bullet animation
		context.drawImage(
			sprite.graphic.image, // The sprite sheet image
			sprite.x,             // X position in the sprite sheet
			sprite.y,             // Y position in the sprite sheet
			sprite.width,         // Width of the sprite in the sprite sheet
			sprite.height,        // Height of the sprite in the sprite sheet
			this.x,               // X position on the canvas
			this.y,               // Y position on the canvas
			this.width,           // Render width of the bullet
			this.height           // Render height of the bullet
		);

		this.renderHitbox(context);
	}

	renderHitbox(context) {
			if (DEBUG) { // Toggle this with a global variable or constant
				context.strokeStyle = 'red';
				context.strokeRect(this.x, this.y, this.width, this.height);
			}
		}
}
