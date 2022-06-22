![logo](./assets/cover.png)

<p align="center">
<em>"把书都放在书架上"</em>
<br/>
组织Storybooks以供概览
</p>

<p align="center">
<a href="./README.md">English</a> | 简体中文
</p>

> 📢 CLI `bookcase-builder` 提供了别名 `bb` 供使用。 

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

storybook提供了[ref](https://storybook.js.org/docs/react/sharing/storybook-composition)属性，这样我们可以使用它来将各个包连接在一起，并通过一个地址来访问全部链接的storybook。
```
https://localhost:3000/overview
    |- https://localhost:3000/packages-1
    |- https://localhost:3000/packages-2
    |- https://localhost:3000/packages-3
```
但在使用这个属性前我们还需要修改很多打包配置，来让构建后的产物能互相找到对方，并且这些配置只会在构建overview时才会用到，而且我们还需要为此单独创建一个overview的包并配置它，这太麻烦了，所以这就是这个工具诞生的原因，它可以通过一条指令来完成这其中的全部操作。

> [chromatic](https://www.chromatic.com) 是官方推荐的一个Storybook工具，它可以帮我们很简单的完成这件事，但我们没办法通过它来完成上述构建，并进行私有化部署。

## 安装
```shell
$ npm i bookcase-builder -D
```

## 配置

```json
// package.json

{
  "bookcase-builder": {
    /*
    * [ 📌 必要参数 ]
    * 在哪里查找待构建包
    */
    "workspaces": [
      "packages/*"
    ],
    /*
    * [ 📌 必要参数 ]
    * 将构建产物存放至何处
    */
    "output": "./public",
    /*
    * 修改当前包的名称，默认为目录名
    * e.g.
    * [root]/packages/packageA => http://localhost:3000/packageA
    * 将 basename 设置为 "packageB", 将会变成 http://localhost:3000/packageB
    */
    "basename": "packageB",
    /*
    * Basename of URL.
    * e.g.
    * [root]/packages/packageA => http://localhost:3000/packageA
    * 将 publicURL 设置为 "/PREFIX_URL/", 将会变成 http://localhost:3000/PREFIX_URL/packageA
    */
    "publicURL": "/PREFIX_URL/",
    /*
    * [ 📌 必要参数 ]
    * 正在使用什么包管理工具。
    * 'yarn' | 'npm' | 'pnpm'
    */
    "packageManager": "yarn",
    "storybook": {
      // Storybook的配置目录, 默认为".storybook"
      "configDir": "./.otherStorybookDir"
    }
  }
}
```
## 使用
1. 配置

```json
// 项目根目录的package.json

{
  "bookcase-builder": {
    "workspaces": [
      // 告诉BB去哪里寻找待构建的项目
      "packages/*"
    ],
    // 将构建产物存放至何处
    "output": "./public",
    // 使用了什么包管理工具
    "packageManager": "pnpm"
  }
}
```

```json
// 工作区下待构建项目的package.json
// 这里可以对待购建项目进行配置，比如指定storybook的配置目录
// 若不修改任何配置，可设置为 "{}", 不配置则不会进行构建
{
  "bookcase-builder": {
    // 是否修改名称，默认为当前目录名
    "basename": "其他名称",
    "storybook": {
      // Storybook配置目录，默认为 “.storybook”
      "configDir": "./.otherStorybookDir"
    }
  }
}
```

```typescript
// 工作区下待构建项目的.storybook/main.[js/ts]
import { withOverview } from 'bookcase-builder';

// 将数据传回withOverview(__dirname)返回的函数中
export default withOverview(__dirname)({
  // 原配置
  ...,
});
```

2. 执行命令

```shell
$ bookcase-builder 或 bb
```

## 提示

```shell
$ bb --help
```

## 赞助者

<p align="center">
  <img src='https://github.com/dohooo/sponsors/blob/master/sponsors.png?raw=true'/>
</p>

## 许可

[MIT](./LICENSE) License © 2022 [Dohooo](https://github.com/dohooo)
