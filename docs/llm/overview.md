# Project Overview

VX3 is a developer-first Web3 toolkit for building, testing, and shipping
EVM applications. One CLI (`vx3`) and one library (`vx3` on npm) cover the
whole flow.

- SDK source: <https://github.com/nk4dev/vx> (the `dev` branch is the latest)
- Parent monorepo: <https://github.com/nk4dev/vx3>
- Docs: <https://nknighta.me/vx>
- Homepage: <https://vx.nknighta.me>
- Platform API: <https://api.varius.technology>

## Developer
- **Maintainer**: Nknight AMAMIYA (@nk4dev)
- **Contact**: nknighta@varius.technology

## License
- SDK (`nk4dev/vx`): MIT
- Parent monorepo (`nk4dev/vx3`): Apache-2.0

## Programming Languages
- TypeScript (SDK, CLI, VXC compiler)
- JavaScript
- Solidity (contract templates, Hardhat preset)

## Core Features
- **Project scaffolding**: `vx3 init`, `vx3 create`, `vx3 generate`, `vx3 setup`
- **Local helper API server** (`vx3 api`, port 8545): proxies block / accounts /
  pay to the RPC in `vx.config.json`. It does **not** run an EVM.
- **Real-time dashboard** (`vx3 dash`, port 4000): block number, EIP-1559 gas
  fees, RPC status, SSE activity log.
- **Payments**: `vx3 pay` and `payment.sendPayment()`.
- **NFT minting**: `vx3 nft mint` and `mintNFT()` (auto-detects common ERC-721
  `mint` / `safeMint` signatures).
- **Gas monitoring**: `vx3 gas` and `getGasFees()` (plain-JSON gwei/wei strings).
- **IPFS fetch**: `vx3 ipfs fetch <cid>` via the gateway in `vx.config.json`.
- **VXC**: in-house Solidity compiler frontend (lexer, import resolver,
  artifact pipeline) with a pluggable `solc` backend — `vx3 compile`.
- **React / Vue**: `<Payment />` component and `usePayment`,
  `usePaymentStatus`, `usePaymentDialog` hooks.
- **RPC management**: `vx.config.json` with `vx3 rpc init | list`.

## Bundled Packages

| Package | Path (in `nk4dev/vx`) | Purpose |
| --- | --- | --- |
| `@vx3/vxc` | `packages/vxc` | Custom Solidity compiler |
| `@vx3/hardhat` | `packages/hardhat` | Hardhat config preset |
| `@vx3/template` | `packages/template` | Default project template (`vx3 init`) |
| `@vx3/react-template` | `packages/react-template` | React + Vite starter |
| `@vx3/vue-template` | `packages/vue-template` | Vue + Vite starter |
