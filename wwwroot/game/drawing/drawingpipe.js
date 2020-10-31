import { Pipe } from "../pipe.js";

export class DrawingPipe extends Pipe {
    constructor(width, height) {
        super(width, height);

        this.color = "grey";
    }
    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x - 2, 0, this.width + 4, this.topPipe + 2);
        ctx.fillRect(this.x - 2, this.ctxHeight - this.bottomPipe - 2, this.width + 4, this.bottomPipe + 2);

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.topPipe);
        ctx.fillRect(this.x, this.ctxHeight - this.bottomPipe, this.width, this.bottomPipe);
    }
}