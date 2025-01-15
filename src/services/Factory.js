import EnemyType from "../enums/EnemyType.js";
import SmallEnemy from "../entities/enemies/SmallEnemy.js";
import EnemyStateName from "../enums/EnemyStateName.js";
import Direction from "../enums/Direction.js";
import Animation  from "../../lib/Animation.js";
import MediumEnemy from "../entities/enemies/MediumEnemy.js";
import BigEnemy from "../entities/enemies/BigEnemy.js";
//import Slime from "../entities/enemies/Slime.js";

/**
 * Encapsulates all definitions for instantiating new enemies.
 */
export default class EnemyFactory {
	/**
	 * @param {string} type A string using the EnemyType enum.
	 * @param {array} sprites The sprites to be used for the enemy.
	 * @returns An instance of an enemy specified by EnemyType.
	 */
	static createInstance(type, sprites) {
		switch (type) {
			case EnemyType.Small:
                const smallEnemyAnimations = {
                    [EnemyStateName.Idle]: {
                        [Direction.Still]: new Animation([0, 1], 0.3), 
                    },
                    [EnemyStateName.Moving]: {
                        [Direction.Left]: new Animation([0, 1], 0.3), 
                        [Direction.Right]: new Animation([0, 1], 0.3), 
                    },
                    [EnemyStateName.Shooting]: {
                        [Direction.Still]: new Animation([4, 5], 0.3), 
                    },
                };

                const smallEnemy = new SmallEnemy(sprites);
                smallEnemy.stateMachine = smallEnemy.initializeStateMachine(smallEnemyAnimations);
                return smallEnemy;
            case EnemyType.Medium:
                const mediumEnemyAnimations = {
                    [EnemyStateName.Idle]: {
                        [Direction.Still]: new Animation([0, 1], 0.3), 
                    },
                    [EnemyStateName.Moving]: {
                        [Direction.Left]: new Animation([0, 1], 0.3), 
                        [Direction.Right]: new Animation([0, 1], 0.3), 
                    },
                    [EnemyStateName.Shooting]: {
                        [Direction.Still]: new Animation([4, 5], 0.3),
                    },
                };
    
                const mediumEnemy = new MediumEnemy(sprites);
                mediumEnemy.stateMachine = mediumEnemy.initializeStateMachine(mediumEnemyAnimations);
                return mediumEnemy;
            case EnemyType.Big:
                const bigEnemyAnimations = {
                    [EnemyStateName.Idle]: {
                        [Direction.Still]: new Animation([0, 1], 0.3),
                    },
                    [EnemyStateName.Moving]: {
                        [Direction.Left]: new Animation([0, 1], 0.3), 
                        [Direction.Right]: new Animation([0, 1], 0.3), 
                    },
                    [EnemyStateName.Shooting]: {
                        [Direction.Still]: new Animation([4, 5], 0.3), 
                    },
                };
        
                const bigEnemy = new BigEnemy(sprites);
                bigEnemy.stateMachine = bigEnemy.initializeStateMachine(bigEnemyAnimations);
                return bigEnemy;
		}
	}
}