# Command Reference

The VX3 CLI binary is `vx3`. Running it with no arguments prints help.

```bash
vx3 <command> [...options]
```

## Command List

| Command | Description |
| :--- | :--- |
| `vx3 init [name]` | Create a project directory (default `my-vx-project`) from the template. Fails if it exists. |
| `vx3 create [name]` | Same as `init` when `name` is given; interactive when omitted. |
| `vx3 api` | Start the local helper API server (default `127.0.0.1:8545`). Does **not** run an EVM. |
| `vx3 dash` | Open the real-time developer dashboard (default `127.0.0.1:4000`). |
| `vx3 setup hardhat\|react` | Add Hardhat or a React frontend to the current project. |
| `vx3 rpc init\|list` | Create a starter `vx.config.json` / print the configured RPC URL. |
| `vx3 pay <to> <amount>` | Send ETH. |
| `vx3 gas` | Show current gas fees from your RPC. |
| `vx3 ipfs fetch <cid> [gateway]` | Fetch IPFS content by CID. |
| `vx3 nft mint <contract>` | Mint an NFT. |
| `vx3 generate template/<react\|vue> [dir]` | Generate a frontend template (`vx3 generate list` to list). |
| `vx3 compile <entry.sol>` | Compile Solidity with the VXC compiler. |
| `vx3 sol hello` | Solidity helper sample (prints `hello world`). |
| `vx3 info` | Show the remote VX platform version (`https://api.varius.technology/version`). |
| `vx3 -v`, `vx3 --version` | Show SDK version. |
| `vx3 help` | Show help. |

Deprecated: `vx3 node` is a hidden alias of `vx3 api`. `vx3 serve` no longer
exists — use `vx3 api --debug`.

## Configuration: `vx.config.json`

Read from the **current directory only**. It is an array of endpoints; the
first RPC entry is the one that is used.

```json
[
  { "host": "localhost", "port": 8545, "protocol": "http", "type": "rpc" },
  { "type": "ipfs", "gateway": "https://ipfs.io" }
]
```

- RPC entry: `host`, `port`, `protocol` (`http|https|ws|wss`) are required.
  `type` defaults to `rpc`.
- IPFS entry: `type: "ipfs"` plus `gateway` (URL) or `api` `{ host, port, protocol }`.

Environment variables:
- `PRIVATE_KEY` — signer key for `vx3 pay`, `vx3 nft mint`, and `/api/pay`
  when `--key` is not passed. Never commit a real key.

## Command Usage Details

### Project
```bash
vx3 init my-app      # copies packages/template (Sample.sol, vx.config.json)
vx3 create           # interactive
```

### RPC
```bash
vx3 rpc init         # writes a starter vx.config.json
vx3 rpc list         # prints "RPC : <url>"
```

### Local API server
```bash
vx3 api                    # http://127.0.0.1:8545
vx3 api --port 8000
vx3 api --host 0.0.0.0
vx3 api --debug            # enables /debug
```

| Flag | Default | Description |
| --- | --- | --- |
| `--host <host>` | `127.0.0.1` | Interface to bind to. |
| `--port <port>` | `8545` | Port (falls back to 8545 if not a number). |
| `--debug` | off | Serve the `/debug` page. |
| `--env <name>` | `development` | Label shown in debug output. |
| `--chains <json>` | — | Chain list shown in debug output; invalid JSON is ignored. |

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api` | GET | Welcome message. |
| `/api/block` | GET | `{ "blockNumber": n }` from the configured RPC. |
| `/api/accounts` | GET | Generated dev accounts (address + display balance). |
| `/api/pay` | POST | Body `{ "to", "amountEth", "rpcUrl"? }` → `{ txHash, receipt }`. |
| `/events` | GET | SSE stream of block updates. |
| `/debug` | GET | Debug page (only with `--debug`, otherwise 404). |

Security:
- `/api/pay` never accepts a private key in the body. It signs with
  `PRIVATE_KEY`, or dev account 0 when unset.
- Requests whose `Origin` does not match the server's own origin get `403`.
- The 10 dev accounts come from Hardhat's public `test test ... junk`
  mnemonic. Never use them on a public network.

### Dashboard
```bash
vx3 dash                   # http://127.0.0.1:4000
vx3 dash --port 5000
vx3 dash --host 0.0.0.0    # no auth — trusted networks only
vx3 dash --open            # open in browser
```

| Endpoint | Method | Description |
| --- | --- | --- |
| `/` | GET | Dashboard HTML |
| `/api/status` | GET | Server + RPC status |
| `/api/block` | GET | Latest block number |
| `/api/gas` | GET | EIP-1559 gas fee data |
| `/api/rpc` | GET | RPC config list |
| `/events` | GET | SSE (block + gas, every 4 s) |

### Gas
```bash
vx3 gas
vx3 gas --rpc https://rpc.example.com --json
```

### Payments
```bash
vx3 pay <to> <amountEth> [-r|--rpc <url>] [-k|--key <hex>] [--json]
```
```bash
# bash
export PRIVATE_KEY=0x...
vx3 pay 0xRecipientAddress 0.01 --rpc http://127.0.0.1:8545

# PowerShell
$env:PRIVATE_KEY='0x...'
vx3 pay 0xRecipientAddress 0.01
```
Prefer the `PRIVATE_KEY` env var over `--key` (flags end up in shell history).

### NFT
```bash
vx3 nft mint <contract> [--to <addr>] [--id <tokenId> | --uri <tokenURI>] \
  [--fn <name>] [-r|--rpc <url>] [-k|--key <hex>] [--json]
```
- `--uri` only → `safeMint(address,string)`
- `--id` only → `mint(address,uint256)`
- both, or neither → error. For other signatures use `--fn`; a custom ABI is
  only available through the library (`mintNFT({ abi })`).
- `--to` defaults to the signer address.

### IPFS
```bash
vx3 ipfs fetch <cid>                       # gateway from vx.config.json
vx3 ipfs fetch <cid> https://ipfs.io       # explicit gateway
```

### Setup
```bash
vx3 setup hardhat   # then: npm install -D hardhat @nomicfoundation/hardhat-toolbox
vx3 setup react     # adds Payment.tsx, hooks, App.tsx, vite.config.ts, tsconfig.json
```

### Generate
```bash
vx3 generate list
vx3 generate template/react my-web
vx3 generate template/vue my-web --debug   # --debug links the local SDK
```

### Compile (VXC)
```bash
vx3 compile contracts/Token.sol \
  --out build \
  --optimize --runs 1000 \
  --evm cancun \
  --remap @openzeppelin/=node_modules/@openzeppelin/
```

| Flag | Default | Description |
| --- | --- | --- |
| `-o, --out <dir>` | `artifacts/vxc` | Output directory |
| `--optimize` | off | Enable optimizer |
| `--runs <n>` | `200` | Optimizer runs |
| `--evm <version>` | — | Target EVM (paris, shanghai, cancun, …) |
| `--base <dir>` | cwd | Base path for resolution |
| `--metadata` | off | Emit Solidity metadata |
| `--remap k=v` | — | Import remapping (repeatable) |

Output: `<Contract>.json` (abi, bytecode, deployedBytecode, compiler info) and
`vxc.manifest.json`. The standalone binary `vxc` accepts the same flags.

## Best Practices
- Keep `vx.config.json` in the project root and run `vx3` from there.
- Use `PRIVATE_KEY` from the environment; never commit keys.
- Bind `vx3 api` / `vx3 dash` to `127.0.0.1` unless on a trusted network.
- Use `--json` on `pay`, `gas`, `nft mint` for scripting.
