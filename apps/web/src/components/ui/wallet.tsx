
import * as React from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useEnsAvatar,
  useBalance,
} from "wagmi";
// No need to import InjectedConnector in wagmi v2+; connectors are provided by config
import { Button } from "./button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./dropdown-menu";
import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export function Wallet() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors, status: connectStatus, error: connectError } = useConnect();
  const isConnecting = connectStatus === 'pending';
  const [pendingConnector, setPendingConnector] = React.useState<any>(null);
  const [isDisconnecting, setIsDisconnecting] = React.useState(false);
  const { data: ensName, isLoading: ensLoading } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName ?? undefined });
  const { data: balance, isLoading: balanceLoading } = useBalance({ address });

  if (!isConnected) {
    return (
      <Card className="w-full max-w-xs mx-auto">
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => {
                setPendingConnector(connector);
                connect({ connector });
              }}
              className="w-full mb-2"
            >
              {isConnecting && pendingConnector?.id === connector.id ? "Connecting..." : `Connect with ${connector.name}`}
            </Button>
          ))}
          {connectError && <div className="text-red-500 text-xs mt-2">{connectError.message}</div>}
        </CardContent>
      </Card>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {ensAvatar ? (
            <img src={ensAvatar} alt="ENS Avatar" className="w-6 h-6 rounded-full" />
          ) : (
            <span className="w-6 h-6 rounded-full bg-gray-200" />
          )}
          <span className="truncate max-w-[100px]">
            {ensLoading ? <Skeleton className="w-16 h-4" /> : ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex flex-col items-center py-2">
          {ensAvatar ? (
            <img src={ensAvatar} alt="ENS Avatar" className="w-12 h-12 rounded-full mb-2" />
          ) : (
            <span className="w-12 h-12 rounded-full bg-gray-200 mb-2" />
          )}
          <div className="font-semibold text-lg">
            {ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
          </div>
          <div className="text-xs text-muted-foreground mb-1">{address}</div>
          <div className="text-sm">
            {balanceLoading ? <Skeleton className="w-16 h-4" /> : balance ? `${balance.formatted} ${balance.symbol}` : null}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            setIsDisconnecting(true);
            await disconnect();
            setIsDisconnecting(false);
          }}
          disabled={isDisconnecting}
          className="text-destructive"
        >
          {isDisconnecting ? "Disconnecting..." : "Disconnect"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
