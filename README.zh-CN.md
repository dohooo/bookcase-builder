![logo](./assets/cover.png)

<p align="center">
组织Storybooks以供概览
</p>

<p align="center">
<a href="./README.md">English</a> | 简体中文
</p>

## 背景
在Monorepo项目中，通常我们会将每个包下的storybook分别构建，并使用CI将storybook部署至服务端。

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

但每个项目部署后访问链接都是独立的。
```
https://localhost:3000/packages-1
https://localhost:3000/packages-2
https://localhost:3000/packages-3
```

storybook提供了[ref](https://storybook.js.org/docs/react/sharing/storybook-composition)属性，这样我们可以使用它来将各个包连接在一起，并通过一个地址来访问全部连接的storybook。
```
https://localhost:3000/overview
    |- https://localhost:3000/packages-1
    |- https://localhost:3000/packages-2
    |- https://localhost:3000/packages-3
```
但在使用这个属性前我们还需要修改很多打包配置，来让构建后的产物能互相找到对方，并且这些配置只会在构建overview时才会用到，而且我们还需要为此单独创建一个overview的包，这太麻烦了，所以这就是这个工具诞生的原因，它可以通过一条指令来完成这其中的全部操作。

> [chromatic](https://www.chromatic.com) 是官方推荐的一个Storybook工具，它可以帮我们很简单的完成这件事，但我们没办法通过它来完成上述构建，并进行私有化部署。

## 安装
```shell
npm i bookcase-builder -D
```

## 配置

```json
// package.json

{
  ...,
  // default settings
  "bookcase-builder":{
    "workspaces": [
      "packages/*", 
    ],
    "output": "./public",
  },
  ...,
}
```
## 使用
> `bookcase-builder` as `bb`.

```bash
npx bb
```
## 提示

如何修改public url?  
```json
// 比如我们想把它部署到GitHub.

{
  "bookcase-builder": {
    /*
     * 将会变成...
     * https://[用户名].github.io/[仓库名称]/packages-1
     */
    "publicURL": "[仓库名称]"
  }
}
```

## 赞助者

<p align="center">
  <img src='https://github.com/dohooo/sponsors/blob/master/sponsors.png?raw=true'/>
</p>

## 许可

[MIT](./LICENSE) License © 2022 [Dohooo](https://github.com/dohooo)
