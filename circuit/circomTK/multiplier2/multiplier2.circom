pragma circom 2.0.0;

// Circuit sederhana: mengalikan dua bilangan a dan b
// Public: hasil (c)
// Private: a, b

template Multiplier2() {
    // Sinyal input
    signal input a;
    signal input b;

    // Sinyal output publik
    signal output c;

    // Constraint utama: c = a * b
    c <== a * b;
}

// Component utama
component main = Multiplier2();
