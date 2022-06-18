![logo](./assets/cover.png)

<p align="center">
<em>"Put all the books on the shelf"</em>
<br/>
Compose storybooks for an overview.
</p>

<p align="center">
English | <a href="./README.zh-CN.md">简体中文</a>
</p>

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
  // default settings
  "bookcase-builder": {
    "workspaces": [
      "packages/*"
    ],
    "output": "./public"
  }
}
```
## Usage
> `bookcase-builder` as `bb`.

```bash
npx bb
```

## Tips

How to modify the public url?  
```json
// e.g. We want to deploy it to the GitHub.

{
  "bookcase-builder": {
    /*
     * It will be...
     * https://[username].github.io/[repository name]/packages-1
     */
    "publicURL": "[repository name]"
  }
}
```

## Sponsors

<p align="center">
  <img src='https://github.com/dohooo/sponsors/blob/master/sponsors.png?raw=true'/>
</p>

## License

[MIT](./LICENSE) License © 2022 [Dohooo](https://github.com/dohooo)
