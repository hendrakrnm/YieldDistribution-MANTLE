const fs = require('fs');
const path = require('path');
const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');

// Lokasi penyimpanan file
const OUTPUT_DIR = path.join(__dirname, '..', 'output');
const KEYS_FILE = path.join(__dirname, '..', 'issuer-keypair.json');

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

// Generate atau load issuer keypair (Ed25519)
function getOrCreateIssuerKeypair() {
  if (fs.existsSync(KEYS_FILE)) {
    const data = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8'));
    return {
      publicKey: naclUtil.decodeBase64(data.publicKey),
      secretKey: naclUtil.decodeBase64(data.secretKey),
    };
  }

  const keypair = nacl.sign.keyPair(); // Ed25519
  const toStore = {
    publicKey: naclUtil.encodeBase64(keypair.publicKey),
    secretKey: naclUtil.encodeBase64(keypair.secretKey),
  };
  fs.writeFileSync(KEYS_FILE, JSON.stringify(toStore, null, 2));
  console.log('Issuer keypair generated at', KEYS_FILE);
  return keypair;
}

// Helper: sign payload JSON dengan Ed25519
function signCredential(payload, keypair) {
  const message = naclUtil.decodeUTF8(JSON.stringify(payload));
  const signature = nacl.sign.detached(message, keypair.secretKey);
  return naclUtil.encodeBase64(signature);
}

// Investor contoh (5 investor)
const INVESTORS = [
  { subject: '0x1111111111111111111111111111111111111111' },
  { subject: '0x2222222222222222222222222222222222222222' },
  { subject: '0x3333333333333333333333333333333333333333' },
  { subject: '0x4444444444444444444444444444444444444444' },
  { subject: '0x5555555555555555555555555555555555555555' },
];

async function main() {
  ensureOutputDir();
  const issuerId = 'did:example:issuer-1';

  const keypair = getOrCreateIssuerKeypair();
  const publicKeyB64 = naclUtil.encodeBase64(keypair.publicKey);

  const issuedAt = new Date().toISOString();

  INVESTORS.forEach((inv, idx) => {
    const payload = {
      issuer: issuerId,
      subject: inv.subject,
      claims: {
        accredited: true,
      },
      issuedAt,
    };

    const sigB64 = signCredential(payload, keypair);

    const credential = {
      ...payload,
      signature: {
        alg: 'Ed25519',        // EdDSA di atas kurva Ed25519
        publicKey: publicKeyB64,
        sig: sigB64,
      },
    };

    const filename = path.join(OUTPUT_DIR, `credential_investor_${idx + 1}.json`);
    fs.writeFileSync(filename, JSON.stringify(credential, null, 2));
    console.log('Wrote', filename);
  });

  console.log('Done. Issuer public key (base64):', publicKeyB64);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
