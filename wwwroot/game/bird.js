import { NeuralNetwork } from "../NN/neural-network.js";

const firstnames = ["Tom", "Billy", "Suzzy", "Karl", "Ricky", "Mary", "Jane", "Charlotte"];
const surnames = ["Smith", "Hudson", "Featherbottom"];
export class Bird {
    constructor(width, height, brain = undefined, mutate = true) {
        this.width = width;
        this.height = height;
        this.name = `${firstnames[Math.floor(Math.random() * firstnames.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`
        this.radius = 10;
        this.centerX = 50
        this.maxVelocity = 10;
        this.gravity = 0.7;
        this.jump = -12;
        this.smart = !!brain;

        this.totScore = 0;
        this.totJumps = 0;

        this.reset();

        if (brain instanceof NeuralNetwork) {
            this.brain = brain;
        } else if (this.smart) this.brain = new NeuralNetwork({
            "hiddenLayers": [10],
            "inputs": 5,
            "outputs": 1,
            "lr": 0.2
        });
    }
    reset() {
        this.totScore += this.score;
        this.totJumps += this.jumps;

        this.centerY = this.height / 2;
        this.velocity = 0;
        this.jumps = 0;
        this.score = 0;
        this.dead = false;
    }
    up(fromBrain = false) {
        if (this.smart && !fromBrain) return;
        this.velocity += this.jump;
        this.jumps++;
    }
    update(pipes) {
        if (this.dead) return;

        if (this.smart) this.calculateMove(pipes);

        this.velocity += this.gravity;
        this.centerY += Math.min(this.velocity, this.maxVelocity);

        this.score += 1;

        if (this.centerY < 0 + this.radius) {
            this.centerY = 0 + this.radius;
            this.velocity = 0;
        }

        if (pipes.filter(pipe => pipe.hit(this)).length > 0 || this.centerY > this.height - this.radius) this.dead = true;
    }
    calculateMove(pipes) {
        let closest = undefined;
        pipes.forEach(pipe => {
            if (pipe.x + pipe.width > this.centerX + this.radius && (!closest || pipe.x < closest.x)) {
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