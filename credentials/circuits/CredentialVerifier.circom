pragma circom 2.0.0;

// Import Poseidon hash dari circomlib
include "../../circuit/circomlib/circuits/poseidon.circom";

// Sesuaikan path ke circomlib (tergantung dimana kamu clone)
// Alternatif: pakai relative path atau set dengan --include flag saat compile

/// @title CredentialVerifier
/// @notice Memverifikasi kredensial tanpa membuka data asli
/// 
/// Public input (orang lain lihat):
///   - issuerPubkeyHash: hash dari public key issuer
///   - claimHash: hash dari klaim (misal "investor accredited = true")
///
/// Private input (hanya prover):
///   - credentialData: array nilai kredensial (issuer_id, subject, claim_type, dll)
///   - credentialSize: jumlah elemen di credentialData (misal 4)

template CredentialVerifier(credentialSize) {
    // Public inputs
    signal input issuerPubkeyHash;
    signal input claimHash;

    // Private inputs
    signal input credentialData[credentialSize];
    
    // Sebagai contoh sederhana (nanti bisa pakai ECDSA library untuk signature verify)
    // Di sini kita skip signature verify untuk Day 10, fokus ke hash verify saja

    // Hitung hash dari credentialData menggunakan Poseidon
    component poseidon = Poseidon(credentialSize);
    
    for (var i = 0; i < credentialSize; i++) {
        poseidon.inputs[i] <== credentialData[i];
    }

    // Verifikasi bahwa hash yang dihitung cocok dengan public claimHash
    poseidon.out === claimHash;

    // Jika constraint di atas satisfied, proof valid
    // (Jika tidak, circuit tidak akan satisfy dan prover tidak bisa buat proof)
}

// Component utama untuk Day 10: size credential = 4 elemen
// (issuer_id, subject_id, claim_type, claim_value)
component main = CredentialVerifier(4);
