![logo](./assets/cover.png)

<p align='center'>[ WIP 🔴 ]</p>

<p align="center">
<em>"Put all the books in the bookcase."</em>
<br/>
Compose storybooks for an overview.
</p>

<p align="center">
English | <a href="./README.zh-CN.md">简体中文</a>
</p>

> 📢 CLI `bookcase-builder` as `bb`.

## Background
In the monorepo project, usually we will have a storybook for each package, and use CI to deploy them to the server.

```
packages
    |--- packages-1
            |--- .storybook
            |--- public
    |--- packages-2
            |--- .storybook
            |--- public
    |--- packages-3
            |--- .storybook
            |--- public
    |--- ...
```

But each project deployment link is independent.
```
https://localhost:3000/packages-1
https://localhost:3000/packages-2
https://localhost:3000/packages-3
```

Storybook provides [ref](https://storybook.js.org/docs/react/sharing/storybook-composition) attribute, which allows us to compose them together, and access them via an address.
```
https://localhost:3000/overview
    |- https://localhost:3000/packages-1
    |- https://localhost:3000/packages-2
    |- https://localhost:3000/packages-3
```
But it's not easy to compose them together. We need to modify a lot of packaging configurations, and create a package for this, and these configurations only need to be used when building overview. It's too complicated, so that's where this tool comes in, and it can do it all in one command.
> The [chromatic](https://www.chromatic.com) tool was officially recommended, and it made it easy for us to do this, but we couldn't use it to complete the build and privatize the deployment.

## Installation
```shell
npm i bookcase-builder -D
```

## Configurations

```json
// package.json

{
  "bookcase-builder": {
    /*
    * [ 📌 Required ]
    * Where to find Packages.
    */
    "workspaces": [
      "packages/*"
    ],
    /*
    * [ 📌 Required ]
    * Directory where to store built files.
    */
    "output": "./public",
    /*
    * Rename the current package name, default to package directory name.
    * e.g.
    * [root]/packages/packageA => http://localhost:3000/packageA
    * Set basename to "packageB", it will be http://localhost:3000/packageB
    */
    "basename": "packageB",
    /*
    * Basename of URL.
    * e.g.
    * [root]/packages/packageA => http://localhost:3000/packageA
    * Set publicURL to "/PREFIX_URL/", it will be http://localhost:3000/PREFIX_URL/packageA
    */
    "publicURL": "/PREFIX_URL/",
    /*
    * [ 📌 Required ]
    * Which package manager is used.
    * 'yarn' | 'npm' | 'pnpm'
    */
    "packageManager": "yarn",
    "storybook": {
      // Storybook directory, default to ".storybook"
      "configDir": "./.otherStorybookDir"
    }
  }
}
```
## Usage
1. Config

```json
// package.json of package root directory.

{
  "bookcase-builder": {
    "workspaces": [
      // Tell BB where to find the packages to be built
      "packages/*"
    ],
    // Let BB where to store the built files
    "output": "./public",
    // What package manager is used.
    "packageManager": "pnpm"
  }
}
```

```json
// package.json in the workspace directory.
// Here you can configure the project to be built. For example specify the storybook configuration directory.
// If you want to use the default configuration, you can set it to "{}". And if haven't configured it, BB will't build it.
{
  "bookcase-builder": {
    // Rename the current package name, default to package directory name.
    "basename": "other name",
    "storybook": {
      // Storybook configuration directory, default to ".storybook"
      "configDir": "./.otherStorybookDir"
    }
  }
}
```

```typescript
// .storybook/main.[js/ts] of the project to be built in the workspace.
import { withOverview } from 'bookcase-builder';

// Let BB know where to find the project to be built, And send original config to the withOverview function.
export default withOverview(__dirname)({
  // Original config.
  ...,
});
```

2. Build

```shell
$ bookcase-builder or bb
```

## Tips

```shell
$ bb --help
```

## Sponsors

<p align="center">
  <img src='https://github.com/dohooo/sponsors/blob/master/sponsors.png?raw=true'/>
</p>

## License

[MIT](./LICENSE) License © 2022 [Dohooo](https://github.com/dohooo)
