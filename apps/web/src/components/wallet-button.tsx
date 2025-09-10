"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export function WalletButton() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied!')
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Wallet className="h-4 w-4" />
            {formatAddress(address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-2 space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              <div className="flex items-center gap-1">
                <code className="text-xs bg-muted px-1 py-0.5 rounded flex-1">
                  {formatAddress(address)}
                </code>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={handleCopyAddress}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Network</p>
              <p className="text-sm">{chain?.name || 'Unknown'}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Etherscan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Connect Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {connectors.map((connector) => (
          <DropdownMenuItem 
            key={connector.uid}
            onClick={() => connect({ connector })}
          >
            <Wallet className="h-4 w-4 mr-2" />
            {connector.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
