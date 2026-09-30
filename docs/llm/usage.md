# Application Usage Guide

How to use the VX3 SDK (`vx3` on npm) as a library.

## Import

### TypeScript / ESM

```ts
import vx from 'vx3';

// First RPC URL from ./vx.config.json (throws VxConfigError if missing)
const rpc = vx.getRpcUrl();

const block = await vx.getBlockNumber(rpc);
const balance = await vx.getBalance(rpc, '0xYourAddress'); // number, in ETH
const gas = await vx.getGasFees(rpc);
```

### CommonJS

```js
const vx = require('vx3'); // default and named exports are merged
vx.getGasFees('http://127.0.0.1:8545').then(console.log);
```

### Named exports

```ts
import vx, {
  instance,          // (configPath?) => { config, configs, rpcUrl }
  payment,           // { sendPayment }
  mintNFT,
  Payment,           // React component
  usePayment, usePaymentStatus, usePaymentDialog,
} from 'vx3';
import type { MintNFTOptions, MintNFTResult, PaymentProps } from 'vx3';
```

The default export `vx` contains: `getRpcUrl`, `data`, `getBlockNumber`,
`getBalance`, `getGasFees`, `payment`, `nft`, `mintNFT`, `instance`.

## Config Helpers (`vx3/core/config`)

```ts
import {
  loadVxConfig, getFirstRpcUrl, getRpcEndpoints, getIpfsEntries,
  writeVxConfig, DEFAULT_VX_CONFIG, VxConfigError,
} from 'vx3/core/config';

try {
  const configs = loadVxConfig();              // or loadVxConfig({ path: './custom.json' })
  const url = getFirstRpcUrl();
} catch (e) {
  if (e instanceof VxConfigError) console.error(e.message);
}
```
Library functions throw `VxConfigError`; they never call `process.exit()`.

## Gas Fees

`getGasFees(rpcUrl)` uses EIP-1559 fields when available and falls back to
legacy `gasPrice`. Every value is a string, so the result is plain JSON:

```ts
{
  unit: 'gwei',
  gasPriceGwei?: string,
  maxFeePerGasGwei?: string,
  maxPriorityFeePerGasGwei?: string,
  baseFeePerGasGwei?: string,
  raw: { gasPrice, maxFeePerGas, maxPriorityFeePerGas, baseFeePerGas } // wei strings or null
}
```

## Payment Module

```ts
import { payment } from 'vx3';

const { txHash, receipt } = await payment.sendPayment({
  rpcUrl: 'http://127.0.0.1:8545',
  privateKey: process.env.PRIVATE_KEY!,
  to: '0xRecipientAddress',
  amountEth: '0.01',
  // optional
  maxPriorityFeePerGas: '2', // gwei
  maxFeePerGas: '30',        // gwei
  gasLimit: 21000,
});
```
Waits for 1 confirmation.

## NFT Minting

```ts
import { mintNFT } from 'vx3';

const { txHash } = await mintNFT({
  rpcUrl: 'http://127.0.0.1:8545',
  privateKey: process.env.PRIVATE_KEY!,
  contractAddress: '0xNftContract',
  tokenURI: 'ipfs://Qm...',   // → safeMint(address,string)
  // tokenId: 1,              // → mint(address,uint256)
  // to: '0x...',             // defaults to the signer
  // functionName: 'myMint', abi: ['function myMint(address,uint256)'],
});
```
Passing both `tokenId` and `tokenURI` with the default ABI throws; supply a
custom `functionName` + `abi` instead.

## IPFS

```ts
import { fetchCid } from 'vx3/dist/core/ipfs';

const { source, data } = await fetchCid('Qm...');          // gateway from vx.config.json
const res = await fetchCid('Qm...', 'https://ipfs.io');    // explicit gateway
// data: string for text/JSON, Uint8Array otherwise
```

## React

### `<Payment />`

```tsx
import { Payment } from 'vx3';

export default function App() {
  return (
    <Payment
      to="0x1234567890abcdef1234567890abcdef12345678"
      amount="0.01"
      currency="ETH"
      mode="wallet"                 // 'api' (default) | 'wallet'
      // apiEndpoint="/api/pay"     // used when mode="api"
      onSuccess={(r) => alert('Paid: ' + r.txHash)}
      onError={(err) => alert('Payment failed: ' + err.message)}
    />
  );
}
```

Modes:
- `api` — POSTs `{ to, amountEth, rpcUrl, currency }` to `apiEndpoint` (default `/api/pay`,
  e.g. `vx3 api`); the server signs.
- `wallet` — uses the EIP-1193 provider at `window.ethereum`
  (`eth_requestAccounts` → `eth_sendTransaction`).

### Hooks

```tsx
import { usePayment, usePaymentStatus, usePaymentDialog, Payment } from 'vx3';

export default function Donate() {
  const { pay, state } = usePayment();          // state: PaymentState
  const dialog = usePaymentDialog();            // { isOpen, open, close, toggle }

  const handlePay = async (amount: string) => {
    try {
      const { txHash } = await pay({ to: '0x1234...5678', amount, mode: 'wallet' });
      alert('Payment successful: ' + txHash);
    } catch (err) {
      alert('Payment failed: ' + (err as Error).message);
    }
  };

  return (
    <div>
      <button onClick={() => handlePay('0.01')}>Pay 0.01 ETH</button>
      <button onClick={dialog.open}>Open Payment Dialog</button>
      {dialog.isOpen && <Payment to="0x1234...5678" amount="0.01" />}
      <div>Status: {state.status}</div>
    </div>
  );
}
```

`usePaymentStatus()` is a standalone status store for your own flows:

```ts
const { status, setPending, setSuccess, setError, reset } = usePaymentStatus();
```

`PaymentState` is one of `{ status: 'idle' }`, `{ status: 'pending', txHash? }`,
`{ status: 'success', txHash, receipt? }`, `{ status: 'error', error }`.

### Next.js Dynamic Route Example

```tsx
import { useRouter } from 'next/router';
import { Payment } from 'vx3';

export default function ItemPage() {
  const { query } = useRouter();
  return (
    <Payment
      to="0x1234567890abcdef1234567890abcdef12345678"
      amount={String(query.amount ?? '0.01')}
      mode="wallet"
    />
  );
}
```

## Template Generation

```bash
vx3 generate list
vx3 generate template/react my-web
vx3 generate template/vue my-web
vx3 setup react      # add Payment component + hooks to the current project
```

## VXC Compiler (library)

```ts
import { VXCompiler, ImportResolver, lex, extractPragmaVersion } from '@vx3/vxc';

const { artifacts, errors } = new VXCompiler().compile({
  entry: 'contracts/Token.sol',
  basePath: process.cwd(),
  outDir: 'build',
  optimizer: { enabled: true, runs: 200 },
  remappings: { '@openzeppelin/': 'node_modules/@openzeppelin/' },
  metadata: true,
});

// Swap the backend: any object with compile(standardJsonInput: string): string
// new VXCompiler(myBackend)
```
