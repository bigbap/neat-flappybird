import { Pipe } from "../pipe.js";

export class DrawingPipe extends Pipe {
    constructor(width, height) {
        super(width, height);
    }
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, 0, this.width, this.topPipe);
        ctx.fillRect(this.x, this.ctxHeight - this.bottomPipe, this.width, this.bottomPipe)
    }
}