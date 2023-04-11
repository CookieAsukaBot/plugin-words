function splitInMessages (input) {
    // Partir en objeto por cada X caracteres
    let i = 0;
    let output = [];
    let letters = 1500;

    while (i < input.length){
        let initIndex = i;
        let endIndex = i + letters;

        output.push(input.substring(initIndex, endIndex));
        i = endIndex;
    }

    // Devolver
    return output;
}

module.exports = splitInMessages;
