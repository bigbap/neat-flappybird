import { NeuralNetwork } from "../NN/neural-network.js";

const firstnames = ["Tom", "Billy", "Suzzy", "Karl", "Ricky", "Mary", "Jane", "Charlotte"];
const surnames = ["Smith", "Hudson", "Featherbottom"];
export class Bird {
    constructor(width, height, brain = undefined, mutate = true) {
        this.width = width;
        this.height = height;

        this.name = `${firstnames[Math.floor(Math.random() * firstnames.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`

        this.radius = 20;
        this.centerX = 50
        this.centerY = this.height / 2;

        this.velocity = 0;
        this.maxVelocity = 5;
        this.gravity = 0.5;

        this.jump = -14;

        this.score = 0;
        this.dead = false;
        this.smart = !!brain;

        if (brain instanceof NeuralNetwork) {
            this.brain = mutate ? brain.mutate() : brain;
        } else if (this.smart) this.brain = new NeuralNetwork({
            "hiddenLayers": [10],
            "inputs": 5,
            "outputs": 1,
            "lr": 0.2
        });
    }
    up(fromBrain = false) {
        if (this.smart && !fromBrain) return;
        this.velocity += this.jump;
    }
    update(pipes) {
        if (this.dead) return;

        if (this.smart) this.calculateMove(pipes);

        this.velocity += this.gravity;
        this.centerY += Math.min(this.velocity, this.maxVelocity);

        this.score += 1;

        if (this.centerY > this.height - this.radius) {
            this.centerY = this.height - this.radius;
            this.velocity = 0;
        }
        if (this.centerY < 0 + this.radius) {
            this.centerY = 0 + this.radius;
            this.velocity = 0;
        }

        if (pipes.filter(pipe => pipe.hit(this)).length > 0) this.dead = true;
    }
    calculateMove(pipes) {
        let closest = undefined;
        pipes.forEach(pipe => {
            if (pipe.x > this.centerX + this.radius && (!closest || pipe.x < closest.x)) {
                closest = pipe;
            }
        });

        let out = this.brain.forward([
            this.centerY / this.width,
            this.velocity / this.maxVelocity,
            closest.x / this.height,
            closest.topPipe / this.height,
            closest.spacing / this.height]);
        if (out.data[0][0] > 0.5) this.up(true);
    }
}