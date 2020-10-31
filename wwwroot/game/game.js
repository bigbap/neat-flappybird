import { Bird } from "./bird.js";
import { Pipe } from "./pipe.js";

const pipeFactory = (w, h) => new Pipe(w, h);
const birdFactory = (w, h, b, m) => new DrawingBird(w, h, b, m);
export class Game {
    constructor(pipeFac = pipeFactory, birdFac = birdFactory, population = 1) {
        this.width = 640;
        this.height = 480;

        this.newBird = birdFac;
        this.newPipe = pipeFac;

        this.population = population;

        this.brain = true;
        this.best = undefined;
        this.mutate = true;

        this.gen = 0;

        this.reset();
    }
    reset() {
        this.birds = [];
        this.pipes = [this.newPipe(this.width, this.height)];

        this.birds = [];
        for (let i = 0; i < this.population; i++) {
            let newBird = this.newBird(this.width, this.height, this.brain, this.mutate);
            this.birds.push(newBird);
        }
    }
    gameLoop() {
        this.update();
    }
    update() {
        for (let bird of this.birds) {
            bird.update(this.pipes)
        }
        if (this.birds.filter(bird => !bird.dead).length === 0) {
            if (this.mutate) this.evolve();
            this.reset();
            return;
        }
        this.pipes.forEach(pipe => pipe.update());

        this.pipes = this.pipes.filter(pipe => !pipe.delete);
        if (this.pipes.length > 0 && this.pipes[this.pipes.length - 1].x < this.width / 2)
            this.pipes.push(this.newPipe(this.width, this.height));
    }
    evolve() {
        let fittest = undefined;
        for (let bird of this.birds) {
            if (!fittest) fittest = bird;
            else {
                if (bird.score > fittest.score) {
                    fittest = bird;
                }
            }
        }
        this.best = !this.best || fittest.score > this.best.score ? fittest : this.best;

        this.brain = fittest.brain;
        this.gen++;
    }
}
