import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { images } from "../../globals.js";
import Enemy from "./Enemy.js";
import EnemyStateName from "../../enums/EnemyStateName.js";
import Direction from "../../enums/Direction.js";
import Animation from "../../../lib/Animation.js";

export default class MediumEnemy extends Enemy {
	//change the values in here, doesn't matter much
	static TILE_WIDTH = 8;
	static TILE_HEIGHT = 8;
    static WIDTH = 32;
    static HEIGHT = 16;
    static MAX_SPEED = 8;
	static MAX_HEALTH = 3;
	static POINTS_PROVIDED = 60;
	static SPEED = 50;

	constructor(sprites) {
		super(sprites, MediumEnemy.WIDTH, MediumEnemy.HEIGHT);

		this.speed = MediumEnemy.SPEED
        this.health = MediumEnemy.MAX_HEALTH;
		this.sprites = sprites;

		const animations = {
			[EnemyStateName.Idle]: {
				[Direction.Still]: new Animation([0, 1], 0.3),
			},
			[EnemyStateName.Moving]: {
				[Direction.Still]: new Animation([0, 1], 0.3),
			}
		};

		this.stateMachine = this.initializeStateMachine(animations);
	}

	update(dt){
		super.update(dt);
	}

	render(){
		super.render();
	}
}