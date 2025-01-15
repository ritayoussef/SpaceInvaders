import State from "../../lib/State.js";
import { images, input, CANVAS_WIDTH, CANVAS_HEIGHT, context, fonts, sounds, timer } from "../globals.js";
import { stateMachine, bullets, powerUps } from "../globals.js";
import GameStateName from "../enums/GameStateName.js";
import ImageName from "../enums/ImageName.js";
import Sprite from "../../lib/Sprite.js";
import SoundName from "../enums/SoundName.js";
import Player from "../entities/Player.js";
import Debug from '../../lib/Debug.js';
import Direction from "../enums/Direction.js";
import StateMachine from "../../lib/StateMachine.js";
import Input from "../../lib/Input.js";
import Health from "../entities/Health.js";
import Enemy from "../entities/enemies/Enemy.js";
import EnemyType from "../enums/EnemyType.js";
import EnemyFactory from "../services/Factory.js";
import PowerUp from "../entities/PowerUp.js";
import GameOverState from "./GameOverState.js";
import SmallEnemy from "../entities/enemies/SmallEnemy.js";
import MediumEnemy from "../entities/enemies/MediumEnemy.js";
import BigEnemy from "../entities/enemies/BigEnemy.js";


export default class PlayState extends State {
	constructor(game) {
        super();
        this.game = game;
        this.player = new Player();
		this.entities = this.generateEnemies()
        this.health = new Health(this.player);
		this.score = 0;
		this.debug = new Debug();
		this.debug.watch('Player', { position: () =>  
			`(${this.player.position.x.toFixed(   2  )}, 

		${this.player.position.y.toFixed(2)})`,
		speed: () => this.player.speed.toFixed(2), 
		direction: () => this.player.direction, 
		state: () => this.player.stateMachine.currentState.name, 
		isAHeld: () => input.isKeyHeld(Input.KEYS.A), 
		isDHeld: () => input.isKeyHeld(Input.KEYS.D),});

		
	}


	enter() {
		this.reset();
		powerUps.length = 0
		bullets.length = 0
	
	}
	exit(){
		
	}
	reset() {
        this.score = 0; 
        this.player.reset(); 
        this.entities = this.generateEnemies(); 
		bullets.length = 0;
    }

	update(dt) {
		timer.update(dt);
	
		// Update bullets
		bullets.forEach((bullet) => {
			bullet.update(dt, [this.player, ...this.entities]);
		});
	
		// Remove bullets marked for removal
		bullets.splice(0, bullets.length, ...bullets.filter((bullet) => !bullet.markedForRemoval));
	
		// Update power-ups
		powerUps.forEach((powerUp) => {
			powerUp.update(dt, this.player);
		});
	
		// Remove power-ups marked for removal
		powerUps.splice(0, powerUps.length, ...powerUps.filter((powerUp) => !powerUp.markedForRemoval));
	
		// Update enemies
		this.entities.forEach((enemy) => {
            enemy.update(dt);
            if (enemy.isDead && enemy.markedForRemoval) {
                this.score += 50; 
                enemy.markedForRemoval = true;
            }
        });
	
		// Remove enemies marked for removal
		this.entities = this.entities.filter((enemy) => !enemy.markedForRemoval);
	
		// Update player
		this.player.update(dt);
		
		// Check if bullets are 0
		if (this.player.bullets === 0) {
			sounds.play(SoundName.GameOver);
			stateMachine.change(GameStateName.GameOver, { score: this.score });
		}

		// Check if the player is dead
		if (this.player.isDead) {
			sounds.play(SoundName.GameOver);
			stateMachine.change(GameStateName.GameOver, { score: this.score });
		}
	
		// Check if all enemies are defeated 
		if (this.entities.length === 0) {
			sounds.play(SoundName.Victory);
			stateMachine.change(GameStateName.Victory, { score: this.score });
		}
	}
	
	
	render() {
		images.render(ImageName.Space, 1, 1, CANVAS_WIDTH - 2, CANVAS_HEIGHT - 2);
		this.entities.forEach((entitiesToRender) => {
			entitiesToRender.render();
		});

		this.player.render();

		bullets.forEach((bullet) => bullet.render());
		powerUps.forEach((powerUp) => powerUp.render());
		this.renderScore();
	}
	renderScore() {
        context.font = "10px Montserrat";
        context.fillStyle = "white";
        context.textAlign = "right";
        context.fillText(`Score: ${this.score}`, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20); 
		context.fillText(`Bullets: ${this.player.bullets}`, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 30);
		context.fillText(`Health: ${this.player.health}`, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 40);
    }

	generateEnemies(){
		const entities = new Array();
		const smallSprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.SmallEnemies),
			SmallEnemy.WIDTH,
			SmallEnemy.HEIGHT,
		);

		const mediumSprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.MediumEnemies),
			MediumEnemy.WIDTH,
			MediumEnemy.HEIGHT,
		);

		const bigSprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.BigEnemies),
			BigEnemy.WIDTH,
			BigEnemy.HEIGHT
		);
		let enemyType = EnemyType.Big;
		let sprites = bigSprites;

		for (let i = 0; i < 10; i++) {
			let enemyTypes = Math.round(Math.random() * 3) + 1;
			
			if(enemyTypes === 1){
				enemyType = EnemyType.Small;
				sprites = smallSprites;
			}
			if(enemyTypes === 2){
				enemyType = EnemyType.Medium;
				sprites = mediumSprites;
			}
			if(enemyTypes === 3){
				enemyType = EnemyType.Big;
				sprites = bigSprites;
			}
			entities.push(EnemyFactory.createInstance(enemyType, sprites));
		}

		return entities
	}	
}
		
			
		
	

