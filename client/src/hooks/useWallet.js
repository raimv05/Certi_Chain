import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { ethereumSepolia } from "../utils/network";

export function useWallet() {
  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState("");

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      setWalletAddress(accounts[0] || "");
    };

    const handleChainChanged = (nextChainId) => {
      setChainId(nextChainId);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    window.ethereum.request({ method: "eth_chainId" }).then(setChainId).catch(() => {});

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  async function ensureSepoliaNetwork() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethereumSepolia.chainIdHex }],
      });
    } catch (error) {
      if (error.code !== 4902) {
        throw error;
      }

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: ethereumSepolia.chainIdHex,
            chainName: ethereumSepolia.chainName,
            nativeCurrency: ethereumSepolia.nativeCurrency,
            rpcUrls: ethereumSepolia.rpcUrls,
            blockExplorerUrls: ethereumSepolia.blockExplorerUrls,
          },
        ],
      });
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      throw new Error("MetaMask is required");
    }

    await ensureSepoliaNetwork();

    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setWalletAddress(accounts[0] || "");
    setChainId(await provider.send("eth_chainId", []));
    return accounts[0] || "";
  }

  return {
    walletAddress,
    chainId,
    connectWallet,
    isCorrectNetwork: chainId === ethereumSepolia.chainIdHex,
    expectedNetworkName: ethereumSepolia.chainName,
  };
}
