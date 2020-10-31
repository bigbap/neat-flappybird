export class Statistics {
    static normalize(x, min, max) {
        return (x - min) / (max - min)
    }

    static indexOfMax(arr) {
        if (arr.length === 0) {
            return -1;
        }

        var max = arr[0];
        var maxIndex = 0;

        for (var i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                maxIndex = i;
                max = arr[i];
            }
        }

        return maxIndex;
    }
}

// export function normalize(data) {
//     const normalize_x = (x, min, max) => ((x - min) / (max - min) * 2) - 1;
//     let t = data.transpose();
//     let minmax = [...Array(t.data.length)].map((v, i) => [Math.min.apply(this, t.data[i]), Math.max.apply(this, t.data[i])]);
//     const final = Matrix.FromArray([...Array(t.data.length)]
//         .map((v, i) => [...Array(t.data[i].length)]
//             .map((vv, ii) => normalize_x(t.data[i][ii], minmax[i][0], minmax[i][1])))).transpose();
//     return final;
// }

// export function standardize(data) {
//     const standardize_x = (x, mean, S) => (x - mean) / S;

//     let t = data.transpose();
//     let mean = [...Array(t.data.length)].map((v, i) => t.data[i].reduce((sum, x) => sum + x) / t.data[i].length);
//     let standardDeviation = [...Array(t.data.length)].map((v, i) =>
//         Math.sqrt(t.data[i].map((vv, ii) => Math.pow(vv - mean[i], 2))
//             .reduce((sum, x) => sum + x) / (t.data[i].length - 1)));
//     const final = Matrix.FromArray([...Array(t.data.length)]
//         .map((v, i) => [...Array(t.data[i].length)]
//             .map((vv, ii) => standardize_x(t.data[i][ii], mean[i], standardDeviation[i])))).transpose();
//     return final;
// }