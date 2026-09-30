# Installation Instructions

## Requirements
- **Node.js:** 18+ (built-in `fetch` is used)
- **Bun:** recommended — the SDK repo, its CI and its scripts use Bun
  (`bun install`, `bun run build`). npm / pnpm / yarn also work for consumers.
- A Web3 wallet (e.g. MetaMask) if you use the React `wallet` payment mode.

## Installation Methods

The package on npm is **`vx3`**. It ships the `vx3` binary.

### As a Global CLI Tool

```bash
npm install -g vx3
# or
bun add -g vx3
```

### As a Local Dependency

```bash
npm install vx3
# or
bun add vx3
```

### For One-off Usage

```bash
npx vx3 <command>
# or
bunx vx3 <command>
```

### From Source (latest, `dev` branch)

```bash
git clone -b dev https://github.com/nk4dev/vx
cd vx
bun i
bun run build   # prebuild also builds packages/vxc
bun link        # exposes the `vx3` binary globally
```

The published npm version can lag behind the `dev` branch. Build from source
to get the newest CLI (for example the `api` command).

## Verify

```bash
vx3 --version
vx3 help
```

## Next Step

```bash
vx3 init my-app      # copy the default template into ./my-app
cd my-app
vx3 rpc init         # only needed if vx.config.json is missing
```
