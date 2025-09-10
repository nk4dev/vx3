"use client";

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  
  const { data: balance } = useBalance({
    address: address,
  })

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard!')
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatBalance = (balance: any) => {
    if (!balance) return '0'
    return parseFloat(balance.formatted).toFixed(4)
  }

  if (isConnected && address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </CardTitle>
          <CardDescription>
            Connected to {chain?.name || 'Unknown Network'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Address</p>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {formatAddress(address)}
                </code>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleCopyAddress}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
                  className="h-8 w-8 p-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium">Balance</p>
            <p className="text-2xl font-bold">
              {formatBalance(balance)} {balance?.symbol || 'ETH'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {chain?.name}
            </Badge>
            <Badge variant="outline">
              Chain ID: {chain?.id}
            </Badge>
          </div>

          <Button 
            onClick={() => disconnect()} 
            variant="outline"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet to access Web3 features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            variant="outline"
            className="w-full justify-start"
          >
            <Wallet className="h-4 w-4 mr-2" />
            {connector.name}
            {isPending && ' (connecting...)'}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
