import meow from 'meow'

function cliSetup() {
  const cli = meow(`
  Usage
    $ bb [options]

  Options
    -o, --output <dir-name>          Directory where to store built files
    -p, --publicURL <public-url>     Basename of URL. (e.g. www.xxx.com/[publicURL/a/b/c])
    -h, --help                       display help for command

  Examples
    $ bb -o ./
`, {
    importMeta: import.meta,
    flags: {
      output: {
        type: 'string',
        alias: 'o',
      },
      publicURL: {
        type: 'string',
        alias: 'p',
      },
    },
  })

  return cli
}

export const cli = cliSetup()
