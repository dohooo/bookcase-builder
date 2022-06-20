import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/build',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
})
