function RandomRange(min, max) {
    return Math.random() * (max - min) + min;
}

export class Pipe {
    constructor(width, height) {
        this.ctxWidth = width;
        this.ctxHeight = height;

        this.width = 35;

        this.speed = 6;
        this.spacing = 175;

        this.topPipe = RandomRange(10, this.ctxHeight - this.spacing - 10);
        this.bottomPipe = this.ctxHeight - (this.topPipe + this.spacing);

        this.x = this.ctxWidth;

        this.delete = false;
    }

    update() {
        this.x -= this.speed;
        if (this.x < -this.width) {
            this.delete = true;
        }
    }

    hit(bird) {
        const yCollision = bird.centerY + bird.radius < this.topPipe ||
            bird.centerY - bird.radius > this.ctxHeight - this.bottomPipe
        const xCollision = bird.centerX + bird.radius > this.x && bird.centerX - bird.radius < this.x + this.width
        return yCollision && xCollision;
    }
}