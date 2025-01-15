import State from "../../lib/State.js";
import ImageName from "../enums/ImageName.js";
import { images, input, CANVAS_WIDTH, CANVAS_HEIGHT, context, fonts, sounds } from "../globals.js";
import { stateMachine } from "../globals.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";


export default class TitleScreenState extends State {
	constructor(game) {
		super();
		this.game = game;
	}
	exit(){
		
	}
		render() {
			sounds.play(SoundName.GameStart);
			images.render(ImageName.Background, 1, 1, CANVAS_WIDTH, CANVAS_HEIGHT);
			
			}
			
			update() {
				if (input.isKeyPressed('Enter')) {
					stateMachine.change(GameStateName.Play);
				}
			}
		}
	
		