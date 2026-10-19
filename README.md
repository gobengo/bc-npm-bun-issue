# Repro: `@blockchaincommons/*` packages can't be installed

`npm install @blockchaincommons/envelope@1.0.0-beta.4` fails. The cause is the `postinstall` that most `@blockchaincommons/*` packages declare:

```json
"postinstall": "bun scripts/pin-lint-typescript.ts"
```

`scripts/` isn't in the published package (`files` is `["dist", "src", …]`), and npm runs `postinstall` for every consumer.

Affected (as installed by `envelope@1.0.0-beta.4`): `components@1.0.0-beta.4`, `envelope@1.0.0-beta.4`, `known-values@1.0.0-beta.4`, and `crypto`, `dcbor`, `rand`, `shamir`, `sskr`, `tags`, `uniform-resources` at `1.0.0-beta.3`. `xid` and `provenance-mark` don't declare it.

## The workflow

[`.github/workflows/repro.yml`](.github/workflows/repro.yml) runs on every push:

| Job | Result | Error |
| --- | --- | --- |
| `install-without-bun` | fails | `sh: 1: bun: not found` |
| `install-with-bun` | fails | `error: Module not found "scripts/pin-lint-typescript.ts"` |
| `install-ignore-scripts` | passes | lists each package's postinstall, then runs `smoke.mjs` |

## Locally

```sh
npm install                   # fails
npm install --ignore-scripts  # works
node smoke.mjs
```

## Suggested fix

Move the script to `prepare`, which doesn't run for registry installs, or drop it from the published `package.json`.
