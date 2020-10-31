import { RNG } from "./lib/RNG.js";
import { Matrix } from "./lib/matrix.js";

const rng = new RNG(20);

const Activations = {
    Sigmoid: {
        A: (x) => 1 / (1 + Math.exp(-x)),
        dA: (x) => Activations.Sigmoid.A(x) * (1 - Activations.Sigmoid.A(x))
    },
    Relu: {
        A: (x) => (x) => Math.max(0, x),
        dA: (x) => x > 0 ? 1 : 0
    }
};

const Cost = (t, a) => 0.5 * ((t - a) ** 2);
const Cost_Prime = (t, a) => t - a;

class Layer {
    constructor(weights, biases, activation) {
        this.weights = weights;
        this.biases = biases;
        this.activation = activation;
    }

    forward(inputs) {
        this.inputs = inputs;
        const z = this.weights.dot(inputs).add(this.biases);
        this.output = z.apply(this.activation.A);
        this.dActivation = z.apply((v) => this.activation.dA(v));

        return this.output;
    }
}

export class NeuralNetwork {
    constructor(props) {
        this.aFunc = Activations[props.activation || "Sigmoid"];
        this.inputs = props.inputs;
        this.outputs = props.outputs;
        this.hiddenLayers = props.hiddenLayers;
        this.lr = props.lr;

        const input_n = [props.inputs, ...props.hiddenLayers];
        const layers_n = [...props.hiddenLayers, props.outputs];

        this.layers = props.layers || [...Array(layers_n.length)].map((v, i) => new Layer(
            new Matrix(layers_n[i], input_n[i], () => rng.nextFloat() - 0.5),
            new Matrix(layers_n[i], 1, () => 0),
            Activations.Sigmoid
        ));

    }
    forward(X) {
        /**
         * y = a(((x1 * w1) + (x2 * w2) +... (xn * wn)) + b)
         */

        let input = Matrix.FromArray([X]).transpose();

        let output = undefined;
        this.layers.forEach(layer => {
            output = layer.forward(input);
            input = output;
        });

        return output;
    }
    train(data) {
        let dataTable
        for (let i in [...Array(1)].fill(0)) {

            dataTable = [[...[...Array(data.inputs[0].length)].map(() => "input"),
            ...[...Array(this.outputs)].map(() => "output"),
            ...[...Array(this.outputs)].map(() => "target"),
            ...[...Array(this.outputs)].map(() => "error")]];

            data.inputs.forEach((x, i) => {
                const output = this.forward(x);

                const targets = output.apply((val, row, col) => data.targets[i] === row ? 0.99 : 0.01);
                const cost = output.apply((a, row, col) => Cost(targets.data[row][col], a));

                let totalCost = 0;
                cost.data.forEach(row => row.forEach(x => totalCost += x));
                totalCost /= cost.cols;
                console.log(`totalCost: ${totalCost}`);

                this.backpropagation(targets.apply((t, row, col) => -1 * Cost_Prime(t, output.data[row][col])));

                dataTable.push([...x, ...output.flatten(), ...targets.flatten(), ...cost.flatten()]);
            });
        }

        // console.table(dataTable);
    }
    loss(expected, actual) {
        let loss = actual.data.map((x, i) => Math.pow(x - expected.data[i], 2))
            .reduce((sum, i) => sum + i);
        return loss;
    }
    visualize() {
        console.log(`weights:`);
        for (let i in this.weights) {
            console.log(`hidden layer ${i}...`)
            console.table(this.weights[i].data);
        }
        console.log(`biases:`);
        for (let i in this.biases) {
            console.log(`hidden layer ${i}...`)
            console.table(this.biases[i].data);
        }
    }
    backpropagation(cost) {
        let thisCost = cost;
        let dEda;
        for (let i = this.layers.length - 1; i >= 0; i--) {
            dEda = new Matrix(
                this.layers[i].dActivation.rows,
                this.layers[i].dActivation.cols,
                (row, col) => thisCost.data[row][col] * this.layers[i].dActivation.data[row][col]);

            const delta = dEda.dot(this.layers[i].inputs.transpose()).apply(v => v * this.lr);

            // calculate next error
            thisCost = this.layers[i].weights.transpose().dot(thisCost);

            this.layers[i].weights = this.layers[i].weights.subtract(delta);
            // delta.print();
        }
    }
    mutate() {
        const clone = new NeuralNetwork({
            inputs: this.inputs,
            outputs: this.outputs,
            hiddenLayers: this.hiddenLayers,
            lr: this.lr
        });
        for (let i in clone.layers) {
            const oldLayer = this.layers[i];
            clone.layers[i].weights = new Matrix(oldLayer.weights.rows, oldLayer.weights.cols,
                (row, col) => Math.random() < 0.1 ? Math.random() - 0.5 : oldLayer.weights.data[row][col]);
        }
        return clone;
    }
}
