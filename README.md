# vx3

The Web3 SDK for Payment, NFT, and more.

 [![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Packages
sdk package is in [package/vx](https://github.com/nk4dev/vx/tree/52880bca70c6969a97bfdbd58618a27019e16a81)

- package/vx3: The core package of vx3
- apps/web
- apps/server

## Features
<strong>

- No Connection Required of API
- NO Saas Fee
- Multi Chain Supported
- Easy to Use
- Simple API
</strong>


## Use Cases
- Payment
- GameFi
- NFT

## Getting Started

### Prerequisites
```
Node.js v16 or later
npm v8 or later
Metamask or other Web3 Wallet
```
### Create App (Web)

#### 1. Dashboard on Web
https://dash.varius.technology/create/project

#### 2. Sign In with CLI
```bash
npx vx3 auth signin
```

Link Project
```bash
npx vx3 link
```

### Create App (CLI)
```bash
npx vx3 create <project-name>
```

### Start Server for Development
```bash
npx vx3 server --debug
```

Port Number
```bash
npx vx3 server --debug --port <port-number>
```

### Specify Path to vx.config.json
```bash
npx vx3 serve -p "../vx.config.json"
```
## Send

- for javascript
```javascript
import { vx } from "vx3";
vx.send({
  to: "0x1234...abcd",
  amount: "0.01",
  currency: "ETH",
  from: "0x5678...efgh", // optional
  sendSignature: true, // optional
});
```
- for React
```jsx
import { vx } from "vx3";

export default function App() {
  const handleSend = async () => {
    try {
      const txHash = await vx.send({
        to: "0x1234...abcd",
        amount: "0.01",
        currency: "ETH",
        from: "0x5678...efgh", // optional
        sendSignature: true, // optional
      });
      console.log("Transaction Hash:", txHash);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <div>
      <button onClick={handleSend}>Send ETH</button>
    </div>
  );
}
```
## License
Apache-2.0 License

## owner
Nknight AMAMIYA ([@nk4dev](https://nknighta.me/g))