import { Bird } from "../bird.js";

export class DrawingBird extends Bird {
    constructor(width, height, brain = undefined, mutate = true) {
        super(width, height, brain, mutate);

        this.color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.9)`;
    }
    draw(ctx) {
        if (this.dead) return 0;

        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.fillStyle = "rgba(255, 255, 255)";
        ctx.fillText(`score: ${this.score}`, 10, 30);

        return 1;
    }
}