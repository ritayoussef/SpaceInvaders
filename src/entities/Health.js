import GameEntity from './GameEntity.js';
import Sprite from '../../lib/Sprite.js';
import ImageName from '../enums/ImageName.js';
import { images, sounds, context } from '../globals.js';
import Animation from '../../lib/Animation.js';
import Player from './Player.js';


export default class Health {
    static TILE_WIDTH = 16; // Width of each health tile
    static TILE_HEIGHT = 16; // Height of each health tile
    static MAX_HEALTH = 5; // Maximum health for the player

    constructor(player) {
        if (!player) {
            throw new Error("Player object is required for Health class");
        }

        this.player = player; // Reference to the player
        this.position = { x: 10, y: 10 }; 
        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Health),
            Health.TILE_WIDTH,
            Health.TILE_HEIGHT
        );

        // Ensure the sprites are loaded correctly
        if (!this.sprites || this.sprites.length === 0) {
            console.error("Health sprites not loaded correctly");
            return;
        }

        // Animation for reducing health
        this.healthAnimation = new Animation([4, 3, 2, 1, 0], 0.1);
        this.currentFrame = this.sprites.length - 1; // Start with full health
    }

    update() {
        // Validate the player and health properties
        if (!this.player || typeof this.player.health === "undefined") {
            console.error("Player health is undefined");
            return;
        }

        // Update the health animation based on the player's current health
        const healthIndex = Math.max(0, Health.MAX_HEALTH - this.player.health);
        this.currentFrame = this.sprites[healthIndex];
    }

    render(x, y) {
        if (!this.currentFrame) {
            console.error("Current health frame is not defined");
            return;
        }
        // Render the current health sprite
      //  this.currentFrame.render(x, y);
    }
}