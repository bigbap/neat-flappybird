import { DrawingBird } from "./game/drawing/drawingbird.js";
import { DrawingPipe } from "./game/drawing/drawingpipe.js";
import { Game } from "./game/game.js";
import { Api } from "./api.js";

const pipeFactory = (w, h) => new DrawingPipe(w, h);
const birdFactory = (w, h, b, m) => new DrawingBird(w, h, b, m);
class DrawingGame extends Game {
    constructor(canvasId, population = 1, mutate = false) {
        super(pipeFactory, birdFactory, population, mutate);

        const canvas = document.querySelector(canvasId);

        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.zIndex = 8;
        canvas.style.border = "1px solid";

        this.ctx = canvas.getContext("2d");
        this.ctx.font = "20px Arial";

        window.addEventListener("keydown", (ev) => {
            if (ev.key === " ") {
                this.birds.forEach(bird => bird.up());
            }
        });

        this.framerate = 0;
        this.show = true;

        setTimeout(this.gameLoop.bind(this), this.framerate);
    }
    gameLoop() {
        this.update();
        this.draw();

        setTimeout(this.gameLoop.bind(this), this.framerate);
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.show) {
            let draws = 0;
            for (let bird of this.birds) {
                draws += bird.draw(this.ctx);
                if (draws === 5) break;
            }
            this.pipes.forEach(pipe => pipe.draw(this.ctx));

            this.ctx.fillStyle = "rgba(255, 255, 255)";
            this.ctx.fillText(`Current Generation: ${this.gen}. Best Generation: ${this.best ? this.best.gen : "none"} with a score of ${this.best ? this.best.score : 0}`, 10, this.height - 30);
        }
    }
}

let evolutionPopulation = 250;
const game = new DrawingGame("#game", evolutionPopulation, true);
const game2 = new DrawingGame("#gamerandom", evolutionPopulation);

let popInput = document.querySelector("#population");
popInput.value = evolutionPopulation;
document.querySelector("#btnPop").addEventListener("click", (ev) => {
    evolutionPopulation = popInput.value;
    game.population = popInput.value;
    game2.population = popInput.value;
});
document.querySelector("#save").addEventListener("click", (ev) => {
    Api.post("save", game.best);
});
document.querySelector("#load").addEventListener("click", (ev) => {
    game.framerate = 15;
    game.mutate = false;
    game.population = 1;
    game.brain = game.best.brain;
    game.reset();
});
document.querySelector("#evolve").addEventListener("click", (ev) => {
    game.framerate = 0;
    game.mutate = true;
    game.population = evolutionPopulation;
    game.reset();
});
document.querySelector("#myRange").addEventListener("change", ev => {
    let speeds = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    game.framerate = speeds[ev.target.value];
});
document.querySelector("#showrandom").addEventListener("click", ev => {
    game2.show = !game2.show;
});
