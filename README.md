# ZK Yield Distribution Platform

## Project Overview

This project is a privacy-preserving yield distribution system built on the Mantle L2 network. It leverages Zero-Knowledge (ZK) proofs and Merkle Trees to enable secure, efficient, and private distribution of yields to token holders.

By utilizing **SP1 zkVM** for off-chain computation and **Circom** for credential verification, the system ensures that sensitive financial calculations (such as total revenue and specific expense details) remain off-chain, while the integrity of the distribution is mathematically proven on-chain.

## Project Goal

The primary goal of this project is to facilitate a transparent yet private mechanism for issuers to distribute yields to investors. It aims to bridge the gap between traditional finance requirements (privacy of internal data) and decentralized finance benefits (trustlessness and verifiable execution).

## Problem Statement

In traditional on-chain yield distribution systems, two main issues often arise:
1.  **Privacy Leakage**: Calculating yields on-chain often requires exposing sensitive business data such as exact revenue and expense figures to the public ledger.
2.  **Scalability & Cost**: Distributing tokens to a large number of holders individually on-chain is gas-intensive and inefficient.

## Solution & Benefits

This project solves the aforementioned problems through a hybrid architecture:

1.  **Privacy (Zero-Knowledge Proofs)**:
    *   **SP1 zkVM**: The issuer calculates the net yield and generates a distribution Merkle tree off-chain. An SP1 proof serves as a receipt that the calculation is correct according to the pre-defined logic (Revenue - Expenses), without revealing the raw input values.
    *   **Credential Verification**: Investors prove their eligibility (Accredited status, KYC level, Jurisdiction) using a Circom-generated ZK proof, ensuring compliance without revealing their actual identity document data on-chain.

2.  **Scalability (Merkle Trees)**:
    *   Instead of sending transactions to thousands of users, the issuer submits a single **Merkle Root** and the **SP1 Proof** to the smart contract.
    *   Investors claim their yield individually by providing a Merkle Proof, verifying their inclusion in the distribution tree. This reduces the issuer's O(N) complexity to O(1) on-chain.

3.  **Verifiable Integrity**:
    *   The **YieldDistribution.sol** contract acts as the ultimate verifier. It checks the validity of the SP1 proof (via `SP1Verifier`) before accepting a new distribution and verifies the investor's ZK credential validity (via `CredentialVerifier`) before allowing a claim.

## System Architecture

The following diagram illustrates the high-level architecture of the system, divided into the Off-Chain computation layer and the On-Chain verification layer on Mantle L2.

```mermaid
graph LR
    subgraph OffChain [OFF-CHAIN LAYER]
        direction TB
        
        subgraph IssuerSide [ISSUER SIDE]
            I1["1. Input Data:<br/>- Revenue<br/>- Expenses<br/>- Token holders"]
            I2["2. Build Merkle<br/>Tree locally"]
            I1 --> I2
        end
        
        subgraph SP1 [SP1 zkVM<br/>Rust Program]
            S1["• Calculate net yield<br/>• Build merkle root<br/>• Generate proof"]
        end
        
        IssuerSide --> SP1

        subgraph InvestorSide [INVESTOR SIDE]
            Inv1["1. Credential:<br/>- Accredited<br/>- KYC Level<br/>- Jurisdiction"]
            Inv2["2. Generate ZK<br/>Credential Proof"]
            Inv1 --> Inv2
        end

        subgraph Circom [Circom Circuit<br/>Credential]
            C1["• Verify signature<br/>• Check expiry<br/>• Prove claim<br/>• Generate proof"]
        end

        InvestorSide --> Circom
    end

    subgraph OnChain [ON-CHAIN LAYER (Mantle L2)]
        direction TB
        
        subgraph MainContract [YieldDistribution.sol]
            
            subgraph Function1 [FUNCTION 1: submitYieldProof]
                F1Input[/"Input:<br/>- totalYield<br/>- merkleRoot<br/>- sp1Proof"/]
                F1Logic["Logic:<br/>1. Verify SP1 proof<br/>2. Store distribution<br/>3. Emit Event"]
                F1Input --> F1Logic
            end

            subgraph Function2 [FUNCTION 2: claimYield]
                F2Input[/"Input:<br/>- distributionId<br/>- amount, merkleProof<br/>- credentialProof<br/>- nullifier"/]
                F2Logic["Logic:<br/>1. Check nullifier<br/>2. Verify Merkle Proof<br/>3. Verify Credential<br/>4. Transfer & Emit"]
                F2Input --> F2Logic
            end
        end

        SP1Verifier[SP1Verifier.sol]
        CredVerifier[CredentialVerifier]
        
        Function1 -.-> SP1Verifier
        Function2 -.-> CredVerifier
    end

    SP1 -->|Submit Proof| Function1
    Circom -->|Submit Claim| Function2
```

### Component Details

*   **YieldDistribution.sol**: The central orchestrator. It holds the state of all distributions and ensures only valid proofs allow for state changes.
*   **SP1Verifier**: A specific verifier for proofs generated by the SP1 zkVM, ensuring the yield calculation logic was executed correctly off-chain.
*   **CredentialVerifier**: A Verifier for ZK proofs generated by Circom, ensuring the investor meets the necessary compliance criteria.