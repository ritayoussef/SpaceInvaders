import State from "../../lib/State.js";
import { context, canvas, input, images, CANVAS_HEIGHT, CANVAS_WIDTH, stateMachine } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";

export default class VictoryState extends State {
	constructor() {
		super();
		this.options = ["Yes", "No"];
		this.selectedOptionIndex = 0;
		this.score = 0;
	}

	enter(params) {
		this.score = params.score; 
	}

	update() {
		// Handle menu navigation and selection
		this.selectedOptionIndex = this.handleMenuSelection(this.options, this.selectedOptionIndex, (selection) => {
			if (selection === "Yes") {
				stateMachine.change(GameStateName.Play); 
			} else {
				stateMachine.change(GameStateName.TitleScreen); 
			}
		});
	}

	render() {
		// Victory Message
		images.render(ImageName.Victory, 1, 1, CANVAS_WIDTH - 2, CANVAS_HEIGHT - 2);
	
		// Set font and color for "YOU WON!"
		context.font = "40px Arcade";
		context.textAlign = "center";
		context.fillStyle = "white";
		context.fillText("YOU WON!", canvas.width / 2, canvas.height / 2 - 60);
	
		// Final Score
		context.font = "20px Arcade";
		context.fillStyle = "white";
		context.fillText(`Your Score is ${this.score}`, canvas.width / 2, canvas.height / 2 - 20);
	
		// Play Again? Menu
		context.fillStyle = "#4B0082";
		context.fillText("Play Again?", canvas.width / 2, canvas.height / 2 + 10);
	
		// Render menu options
		this.renderMenu(this.options, this.selectedOptionIndex, canvas.height / 2 + 40);
	}
	
	renderMenu(options, selectedOptionIndex, yStart) {
		options.forEach((option, index) => {
			context.fillStyle = index === selectedOptionIndex ? "orange" : "white";
			context.font = "20px Arcade";
			context.fillText(option, canvas.width / 2, yStart + index * 30);
		});
	}
	
	 handleMenuSelection(options, selectedOptionIndex, callback) {
		if (input.isKeyPressed(Input.KEYS.ARROW_UP)) {
			selectedOptionIndex = (selectedOptionIndex - 1 + options.length) % options.length;
		}
		if (input.isKeyPressed(Input.KEYS.ARROW_DOWN)) {
			selectedOptionIndex = (selectedOptionIndex + 1) % options.length;
		}
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			callback(options[selectedOptionIndex]);
		}
		return selectedOptionIndex;
	}
}
