import Animation from '../../../../lib/Animation.js';
// import {
// 	didSucceedChance,
// 	getRandomPositiveInteger,
// 	pickRandomElement,
// } from '../../../../lib/Random.js';
import State from '../../../../lib/State.js';
import Enemy from '../../../entities/enemies/Enemy.js';
import Direction from '../../../enums/Direction.js';
import EnemyStateName from '../../../enums/EnemyStateName.js';
import { timer, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../../globals.js';

export default class EnemyMovingState extends State {
	static IDLE_CHANCE = 0.5;
	static MOVE_DURATION_MIN = 2;
	static MOVE_DURATION_MAX = 6;

	/**
	 * In this state, the enemy moves around in random
	 * directions for a random period of time.
	 *
	 * @param {Enemy} enemy
	 * @param {Animation} animation
	 */
	constructor(enemy, animation) {
		super();
		this.enemy = enemy;
		this.animation = animation;
	}

	enter() {
		// Pick a random direction: Left or Right
		this.enemy.direction = Math.random() < 0.5 ? Direction.Left : Direction.Right;
		this.enemy.currentAnimation = this.animation[this.enemy.direction];
		this.moveDuration = Math.random() * 3 + 2; 
		this.startTimer();
	}

	update(dt) {
		// Move the enemy based on its direction
		if (this.enemy.direction === Direction.Left) {
			this.enemy.position.x = Math.max(0, this.enemy.position.x - this.enemy.speed * dt);
		} else if (this.enemy.direction === Direction.Right) {
			this.enemy.position.x = Math.min(
				CANVAS_WIDTH - this.enemy.dimensions.x,
				this.enemy.position.x + this.enemy.speed * dt
			);
		}
	}

	async startTimer() {
		await timer.wait(this.moveDuration);
		this.decideNextState();
	}

	decideNextState() {
		// Randomly decide to idle or shoot after moving
		const randomState = Math.random();
		if (randomState < 0.5) {
		
			this.enemy.changeState(EnemyStateName.Idle);
		} else {
			
			this.enemy.changeState(EnemyStateName.Shooting);
		}
	}
}