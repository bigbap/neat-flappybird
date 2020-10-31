import { Bird } from "../bird.js";

export class DrawingBird extends Bird {
    constructor(width, height, brain = undefined, mutate = true) {
        super(width, height, brain, mutate);
    }
    draw(ctx) {
        if (this.dead) return;

        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fill();

        ctx.fillStyle = "rgba(255, 255, 255)";
        ctx.fillText(`score: ${this.score}`, 10, 30);
    }
}