import meow from 'meow'

export const cli = meow(`
  Usage
    $ bb [options]

  Options
    -c, --config <path-name>          Config file path name
    -o, --output <dir-name>           Directory where to store built files
    -p, --publicURL <public-url>      Basename of URL. (e.g. www.xxx.com/[publicURL]/a/b/c)
    --help                            display help for command
    --version                         display version for command

  Examples
    $ bb -o ./
`, {
  autoHelp: true,
  autoVersion: true,
  flags: {
    output: {
      type: 'string',
      alias: 'o',
    },
    configFile: {
      type: 'string',
      alias: 'c',
    },
    publicURL: {
      type: 'string',
      alias: 'p',
    },
  },
})
