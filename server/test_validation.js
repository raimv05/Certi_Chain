const api = "http://localhost:5000/api/auth/register";

async function runTest() {
  console.log("🚀 Testing Admin Registration Validation...\n");
  
  const payload1 = {
    email: "admin1_" + Date.now() + "@example.com",
    password: "Password123!",
    name: "Test Admin 1",
    role: "issuer",
    walletAddress: "0xFakeWallet" + Date.now()
  };

  const payload2 = {
    email: "admin2_" + Date.now() + "@example.com", // Different email
    password: "Password123!",
    name: "Test Admin 2",
    role: "issuer",
    walletAddress: payload1.walletAddress // EXACT SAME WALLET
  };

  console.log("➡️ Attempt 1: Registering Admin 1...");
  const res1 = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload1)
  });
  const data1 = await res1.json();
  console.log(`   Status: ${res1.status}`);
  console.log(`   Response:`, data1, "\n");

  console.log("➡️ Attempt 2: Registering Admin 2 with the EXACT SAME MetaMask wallet...");
  const res2 = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload2)
  });
  const data2 = await res2.json();
  console.log(`   Status: ${res2.status}`);
  console.log(`   Response:`, data2, "\n");
}

runTest();
