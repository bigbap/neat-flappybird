export class Matrix {
    constructor(rows, cols, init = () => 0) {
        this.rows = rows;
        this.cols = cols;
        this.data = [...Array(rows)]
            .map((x, row) => [...Array(cols)]
                .map((y, col) => init(row, col)));
    }

    add(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            console.error(`matrices must have same number of rows and cols`);
            return;
        }
        return new Matrix(this.rows, this.cols, (row, col) => this.data[row][col] + other.data[row][col]);
    }
    multiply(vectororscaler) {
        let result
        if (vectororscaler instanceof Matrix && vectororscaler.cols === 1) {
            result = new Matrix(this.rows, this.cols, (row, col) => this.data[row][col] * vectororscaler.data[row][0]);
        } else if (!(vectororscaler instanceof Matrix)) {
            result = new Matrix(this.rows, this.cols, (row, col) => this.data[row][col] * vectororscaler);
        } else {
            console.log("argument must be a vector or a scaler");
        }

        return result;
    }
    subtract(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            console.error(`matrices must have same number of rows and cols`);
            return;
        }
        return new Matrix(this.rows, this.cols, (row, col) => this.data[row][col] - other.data[row][col]);
    }
    dot(other) {
        // Matrix product
        if (this.cols !== other.rows) {
            console.log('Cols of A must match Rows of B.')
            return undefined;
        }
        let result = [...Array(this.rows)].map((row) => [...Array(other.cols)]);
        result = result.map((row, i) => row
            .map((col, ii) => this.data[i].reduce((sum, el, iii) => sum + (el * other.data[iii][ii]), 0)));
        return Matrix.FromArray(result);
    }

    transpose() {
        const matrix = new Matrix(this.cols, this.rows);
        matrix.data = matrix.data.map((v, i) => v.map((vv, ii) => this.data[ii][i]));
        return matrix;
    }

    static FromArray(arr) { // 2d array
        const matrix = new Matrix(arr.length, arr[0].length);
        matrix.data = matrix.data.map((v, i) => v.map((vv, ii) => arr[i][ii]));
        return matrix;
    }

    flatten() {
        if (this.cols > 1) return;
        return [...Array(this.rows)].map((v, i) => this.data[i][0]);
    }

    apply(f) {
        let self = this;
        return new Matrix(this.rows, this.cols, (row, col) => f(self.data[row][col], row, col));
        // return new Matrix(this.rows, this.cols);
    }

    print() {
        console.table(this.data);
    }
}
