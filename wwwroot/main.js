import { DrawingBird } from "./game/drawing/drawingbird.js";
import { DrawingPipe } from "./game/drawing/drawingpipe.js";
import { Game } from "./game/game.js";
import { Api } from "./api.js";

const pipeFactory = (w, h) => new DrawingPipe(w, h);
const birdFactory = (w, h, b, m) => new DrawingBird(w, h, b, m);
class DrawingGame extends Game {
    constructor(population = 1) {
        super(pipeFactory, birdFactory, population);

        const canvas = document.createElement('canvas');

        canvas.id = "game";
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.zIndex = 8;
        canvas.style.position = "absolute";
        canvas.style.border = "1px solid";

        document.querySelector("body").appendChild(canvas);

        this.ctx = canvas.getContext("2d");
        this.ctx.font = "20px Arial";

        window.addEventListener("keydown", (ev) => {
            if (ev.key === " ") {
                this.birds.forEach(bird => bird.up());
            }
        });

        // window.requestAnimationFrame(this.gameLoop.bind(this));
        this.framerate = 0;
        
        setTimeout(this.gameLoop.bind(this), this.framerate);
    }
    gameLoop() {
        this.update();
        this.draw();

        setTimeout(this.gameLoop.bind(this), this.framerate);

        // window.requestAnimationFrame(this.gameLoop.bind(this));
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.birds.forEach(bird => bird.draw(this.ctx));
        this.pipes.forEach(pipe => pipe.draw(this.ctx));

        this.ctx.fillStyle = "rgba(255, 255, 255)";
        this.ctx.fillText(`Generation: ${this.gen}. Best is ${this.best ? this.best.name : "nobody"} with a score of ${this.best ? this.best.score : 0}`, 10, this.height - 30);
    }
}

const evolutionPopulation = 250;
const game = new DrawingGame(evolutionPopulation);

document.querySelector("#save").addEventListener("click", (ev) => {
    Api.post("save", game.best);
});
document.querySelector("#load").addEventListener("click", (ev) => {
    game.framerate = 1000 / 60;
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
