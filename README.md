# @infinite-loop-factory/app-factory

## Toolchain installation

```bash
brew install mise
eval "$(mise activate zsh)" > ./zshrc
source ./zshrc
mise install
```

## Create a new app

```bash
pnpm gen create-module
# choose "native"
```

## Start development

```bash
pnpm start
pnpm start {app-name}
pnpm start {app-name} {platform: ios|android|web}
```
