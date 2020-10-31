import { Bird } from "./bird.js";
import { Pipe } from "./pipe.js";

const pipeFactory = (w, h) => new Pipe(w, h);
const birdFactory = (w, h, b, m) => new Bird(w, h, b, m);
export class Game {
    constructor(pipeFac = pipeFactory, birdFac = birdFactory, population = 1, mutate = true) {
        this.width = 640;
        this.height = 480;

        this.newBird = birdFac;
        this.newPipe = pipeFac;

        this.population = population;

        this.brain = true;
        this.best = undefined;
        this.mutate = mutate;

        this.gen = 0;

        this.reset();
    }
    resetPipes() {
        this.pipes = [this.newPipe(this.width, this.height)];
    }
    reset(fittest = undefined) {
        if (fittest) {
            this.gen++;
            this.best = !this.best || fittest.score > this.best.score ? fittest : this.best;
        }

        this.resetPipes();
        this.birds = [];
        for (let i = 0; i < this.population; i++) {
            let newBird = this.newBird(this.width, this.height, this.mutate && fittest ? fittest.brain.clone() : this.brain, this.mutate);
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
            this.gen++;
            this.reset(this.getFittest());
            return;
        }
        this.pipes.forEach(pipe => pipe.update());

        this.pipes = this.pipes.filter(pipe => !pipe.delete);
        if (this.pipes.length > 0 && this.pipes[this.pipes.length - 1].x < this.width / 2)
            this.pipes.push(this.newPipe(this.width, this.height));
    }
    getFittest() {
        let fittest = undefined;
        let sum = this.birds.reduce((sum, v) => (sum > 0 ? sum : 0) + (v.score - v.jumps));
        for (let bird of this.birds) {
            if (!fittest) fittest = bird;
            bird.fitness = (bird.score - bird.jumps) / sum;
            if (bird.fitness > fittest.fitness) {
                fittest = bird;
            }
        }

        fittest.gen = this.gen;

        return fittest;
    }
}
