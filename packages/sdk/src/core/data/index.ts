import { ethers } from "ethers";

export function getBlockNumber(provider: string): Promise<number> {
    let balance: number = 0;
    const rpcProvider = new ethers.JsonRpcProvider(provider);
    return rpcProvider.getBlockNumber().then((number) => {
        balance = number;
        return balance;
    });
}

export function getBalance(provider: string, useraddres: string): Promise<number> {
    let balance;
    const rpcProvider = new ethers.JsonRpcProvider(provider);
    
    // Check if address is valid before making the request
    if (!useraddres || useraddres.trim() === '') {
        throw new Error('Invalid address: Address cannot be empty');
    }
    
    return rpcProvider.getBalance(useraddres).then((userbalance) => {
        balance = userbalance ? parseFloat(ethers.formatEther(userbalance)) : 0;
        return balance;
    }).catch((error) => {
        console.error(`Error fetching balance for address ${useraddres}:`, error.message);
        throw error;
    });
}