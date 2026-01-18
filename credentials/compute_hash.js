const circomlib = require("circomlibjs");
const { Scalar } = require("ffjavascript");

async function main() {
    const poseidon = await circomlib.buildPoseidon();

    const input = [1, 2, 3, 4];

    const hash = poseidon(input);

    // IMPORTANT: convert to string field element
    const hashStr = poseidon.F.toString(hash);

    console.log("Poseidon hash dari [1,2,3,4]:", hashStr);
}

main();



/*
const poseidon = require("poseidon-hash");

const input = [1, 2, 3, 4]; // credentialData
const hash = poseidon(input);

console.log("Poseidon hash dari [1,2,3,4]:", hash.toString());
*/