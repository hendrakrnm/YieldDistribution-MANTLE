// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title YieldDistribution
/// @notice Menyimpan hasil perhitungan yield dari SP1 (off-chain)
contract YieldDistribution {
    /// @notice Struct bukti yield dari SP1
    struct YieldProof {
        uint256 totalYield;   // total yield (misal dalam wei)
        bytes32 merkleRoot;   // root merkle tree distribusi ke investor
        uint256 timestamp;    // kapan yield ini dihitung
    }

    /// @notice Issuer (property manager) yang berwenang submit yield
    address public issuer;

    /// @notice Bukti yield terbaru yang tersimpan
    YieldProof public latestYieldProof;

    /// @notice Total berapa kali yield pernah di-submit
    uint256 public yieldSubmissionCount;

    /// @notice Event saat yield baru di-submit
    event YieldSubmitted(address indexed issuer, uint256 totalYield, bytes32 merkleRoot, uint256 timestamp);

    /// @param _issuer alamat yang diizinkan submit yield (nanti bisa diganti owner/role-based)
    constructor(address _issuer) {
        issuer = _issuer;
    }

    /// @notice Submit bukti yield baru (BELUM ada verifikasi SP1 / Merkle)
    /// @param totalYield total yield yang akan dibagi
    /// @param merkleRoot root dari merkle tree distribusi ke investor
    /// @param timestamp waktu perhitungan yield (Unix time)
    function submitYieldProof(
        uint256 totalYield,
        bytes32 merkleRoot,
        uint256 timestamp
    ) external {
        // Untuk Day 9 boleh tanpa verifikasi kompleks, tapi minimum:
        // hanya issuer yang boleh submit
        require(msg.sender == issuer, "Not authorized");

        // Simpan ke storage
        latestYieldProof = YieldProof({
            totalYield: totalYield,
            merkleRoot: merkleRoot,
            timestamp: timestamp
        });

        yieldSubmissionCount += 1;

        emit YieldSubmitted(msg.sender, totalYield, merkleRoot, timestamp);
    }
}
