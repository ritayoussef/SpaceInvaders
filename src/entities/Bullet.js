import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images, context, CANVAS_HEIGHT, DEBUG } from "../globals.js";
import GameEntity from "./GameEntity.js";
import Animation from "../../lib/Animation.js";
import Player from "./Player.js";
import Enemy from "./enemies/Enemy.js";

export default class Bullet extends GameEntity {
	static TILE_WIDTH = 16;
	static TILE_HEIGHT = 16;
	static WIDTH = 16; 
	static HEIGHT = 16; 
	static SPEED = 300; 
	static ALIEN_SPEED = 200;

	constructor(x, y, sourceEntity) {
		super();
		this.x = x;
		this.y = y;
		this.sourceEntity = sourceEntity; 
		this.width = Bullet.WIDTH;
		this.height = Bullet.HEIGHT;

		// Generate sprites from the sprite sheet
		this.bulletSprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Shooting),
			Bullet.TILE_WIDTH,
			Bullet.TILE_HEIGHT
		);

		// Animation setup

		this.shootingAnimation = new Animation([0, 1, 2, 3, 4], 0.1); 
		this.dimensions.x = Bullet.WIDTH;
		this.dimensions.y = Bullet.HEIGHT;
		this.sprites = this.bulletSprites;
		this.markedForRemoval = false; 
	}

	update(dt, entities = []) {
		// Update animation
		this.shootingAnimation.update(dt);
	
		// Move the bullet
		if (this.sourceEntity instanceof Player) {
			this.y -= Bullet.SPEED * dt; // Move up for player bullets
		} else if (this.sourceEntity instanceof Enemy) {
			this.y += Bullet.ALIEN_SPEED * dt; // Move down for enemy bullets
		}
	
		// Remove the bullet if it goes off-screen
		if (this.y < 0 || this.y > CANVAS_HEIGHT) {
			this.markedForRemoval = true;
		}
	
		// Check for collisions, ensuring entities is iterable
		if (Array.isArray(entities)) {
			this.checkCollisions(entities);
		} 
		
	}
	
	checkCollisions(entities) {
		for (const entity of entities) {
			// Skip collision check if the bullet belongs to the same entity type
			if (
				(this.sourceEntity instanceof Player && entity instanceof Player) ||
				(this.sourceEntity instanceof Enemy && entity instanceof Enemy)
			) {
				continue;
			}
	
			// Check if the bullet collides with an entity
			if (entity.didCollideWithEntity(this)) {
				this.handleCollision(entity);
				break; // Stop checking other entities once a collision is detected
			}
		}
	}
	renderHitbox(context) {
		if (DEBUG) { // Toggle this with a global variable or constant
			context.strokeStyle = 'red';
			context.strokeRect(this.x, this.y, this.width, this.height);
		}
	}
	
	handleCollision(entity) {
		if (entity instanceof Player) {
			if (!entity.isInvincible) {
				entity.receiveDamage(5); 
			}
		} else if (entity instanceof Enemy) {
			entity.receiveDamage(1); 
			if (entity.isDead) {
				entity.markedForRemoval = true; 
			}
		}
		
		this.markedForRemoval = true; 
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
}