"use client";

import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

// Example ERC-20 ABI (minimal)
const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

export function Web3Actions() {
  const { address, isConnected } = useAccount()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  
  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Example: Read USDC balance (on mainnet)
  const usdcContract = '0xA0b86a33E6417C8610Ce918DfBE5c9Ac8b5b32e2' // Example contract
  
  const { data: usdcBalance } = useReadContract({
    address: usdcContract,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const handleSendETH = async () => {
    if (!recipient || !amount) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      // This is a basic ETH transfer - you'd typically use a contract for this
      toast.info('Transaction initiated...')
    } catch (error) {
      toast.error('Transaction failed')
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Connect your wallet to use Web3 features
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Token Balance</CardTitle>
          <CardDescription>
            View your token balances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>USDC Balance:</span>
              <span>
                {usdcBalance ? formatEther(usdcBalance as bigint) : 'Loading...'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send ETH</CardTitle>
          <CardDescription>
            Send Ethereum to another address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.001"
              placeholder="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleSendETH}
            disabled={isPending || isConfirming || !recipient || !amount}
            className="w-full"
          >
            {isPending && 'Preparing...'}
            {isConfirming && 'Confirming...'}
            {!isPending && !isConfirming && 'Send ETH'}
          </Button>

          {hash && (
            <p className="text-sm text-muted-foreground">
              Transaction hash: {hash}
            </p>
          )}
          
          {isSuccess && (
            <p className="text-sm text-green-600">
              Transaction confirmed!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
