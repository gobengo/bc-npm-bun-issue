# Repro: npm can't install `@blockchaincommons/components` on a host with no `bun`

`@blockchaincommons/components@1.0.0-beta.4` runs Bun in its npm `postinstall`:

```json
"postinstall": "bun scripts/pin-lint-typescript.ts"
```

npm runs `postinstall` for everyone who installs the package. Without Bun it fails with `sh: 1: bun: not found`. With Bun it fails with `Module not found "scripts/pin-lint-typescript.ts"`, because `scripts/` isn't published.

Locally:

```sh
npm install @blockchaincommons/components   # fails
```

## The workflow

[`.github/workflows/repro.yml`](.github/workflows/repro.yml) builds the package from `COMPONENTS_REPO` at `COMPONENTS_REF`, packs it as `npm publish` would, and installs the tarball without Bun and with Bun.

| Branch | Builds | Result |
| --- | --- | --- |
| `main` | `BlockchainCommons/bc-components-ts` @ `master` | both installs fail |
| `suggested-fix` | `gobengo/bc-components-ts` @ `fix-bun-issue` (`postinstall` → `prepare`) | both installs pass |

The two branches differ only in those two lines.

**Why `--ignore-scripts` and then `npm rebuild`:** the package's own dependencies (`crypto`, `dcbor`, `rand`, `sskr`, `tags`, `uniform-resources`) come from npm, and their published versions have the same `postinstall`. Installing with `--ignore-scripts` and then running `npm rebuild @blockchaincommons/components` runs only this package's install scripts, which is the part the fix changes. Once the other packages make the same change, a plain `npm install` works.
