# salesforce-git-plugin

[![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/plugin-project/main/LICENSE.txt)

## Install

```bash
sf plugins install salesforce-git-plugin@x.y.z
```

### Build

To build the plugin locally, make sure to have yarn installed and run the following commands:

```bash
# Clone the repository
git clone git@github.com:omixximo/salesforce-git-plugin

# Install the dependencies and compile
yarn install
yarn build
```

To use your plugin, run using the local `./bin/dev.js` or `./bin/dev.cmd` file.

```bash
# Run using local run file.
./bin/dev.js deploy
```

There should be no differences when running via the Salesforce CLI or using the local run file. However, it can be useful to link the plugin to do some additional testing or run your commands from anywhere on your machine.

```bash
# Link your plugin to the sf cli
sf plugins:link .
# To verify
sf plugins
```

## Commands

<!-- commands -->

- [`sf branch deploy`](#sf-branch-deploy)
- [`sf packagexml generate`](#sf-packagexml-generate)
- [`sf release create`](#sf-release-create)

## `sf branch deploy`

WIP

## `sf package generate`

WIP

## `sf release create`

WIP
