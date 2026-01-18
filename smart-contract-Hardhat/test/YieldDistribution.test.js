const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("YieldDistribution", function () {
  async function deployFixture() {
    const [issuer, otherAccount] = await ethers.getSigners();

    const YieldDistribution = await ethers.getContractFactory("YieldDistribution");
    const contract = await YieldDistribution.connect(issuer).deploy(issuer.address);
    //await contract.deployed();
    await contract.waitForDeployment();

    return { contract, issuer, otherAccount };
  }

  it("should set issuer correctly in constructor", async function () {
    const { contract, issuer } = await deployFixture();

    const storedIssuer = await contract.issuer();
    expect(storedIssuer).to.equal(issuer.address);
  });

  it("should allow issuer to submit yield proof and update storage", async function () {
    const { contract, issuer } = await deployFixture();

    const totalYield = ethers.parseEther("100.0"); // 100 MNT misal
    const merkleRoot = ethers.encodeBytes32String("dummy-root");
    const timestamp = Math.floor(Date.now() / 1000);

    const tx = await contract
      .connect(issuer)
      .submitYieldProof(totalYield, merkleRoot, timestamp);

    await expect(tx)
      .to.emit(contract, "YieldSubmitted")
      .withArgs(issuer.address, totalYield, merkleRoot, timestamp);

    const latest = await contract.latestYieldProof();
    expect(latest.totalYield).to.equal(totalYield);
    expect(latest.merkleRoot).to.equal(merkleRoot);
    expect(latest.timestamp).to.equal(timestamp);

    const count = await contract.yieldSubmissionCount();
    expect(count).to.equal(1);
  });

  it("should revert if non-issuer tries to submit", async function () {
    const { contract, issuer, otherAccount } = await deployFixture();

    const totalYield = ethers.parseEther("50.0");
    const merkleRoot = ethers.encodeBytes32String("dummy-root-2");
    const timestamp = Math.floor(Date.now() / 1000);

    await expect(
      contract
        .connect(otherAccount)
        .submitYieldProof(totalYield, merkleRoot, timestamp)
    ).to.be.revertedWith("Not authorized");

    const count = await contract.yieldSubmissionCount();
    expect(count).to.equal(0);
  });
});
