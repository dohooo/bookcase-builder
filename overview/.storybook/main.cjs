const { join } = require("path")
const { withOverview, packageInfoUtils, findAllPackagesInfo } = require('../../dist/index.cjs');

const packagePath = join(__dirname, '../')

const refs = findAllPackagesInfo({ valid: true,cwd:process.env.__BOOKCASE_BUILDER_PATH__ })
  .reduce((prev, info) => {
    const { basename, basePath } = packageInfoUtils(info)

    if (!basename) {
      return prev;
    }

    prev[basename] = {
      title: basename,
      url: basePath,
    };
    return prev;
  }, {});

module.exports = withOverview(packagePath)({
  stories: ['../stories/**/*stories.mdx'],
  addons: ['@storybook/addon-essentials'],
  refs,
  core: {
    builder: '@storybook/builder-vite',
  }
});
