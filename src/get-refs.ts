import { findAllPackagesInfo } from './find-all-packages'
import { packageInfoUtils } from './package-info-utils'

export interface Ref {
  [name: string]: {
    title: string
    url: string
  }
}

export function getRefs(cb?: (ref: Ref) => Ref) {
  const refs = findAllPackagesInfo({ valid: true, cwd: process.env.__BOOKCASE_BUILDER_ROOT__ })
    .reduce<Ref>((prev, info) => {
      const { basename, basePath } = packageInfoUtils(info)

      if (!basename)
        return prev

      const ref = {
        title: basename,
        url: basePath,
      }

      prev[basename] = ref

      if (cb)
        return cb({ [basename]: ref })

      return prev
    }, {})

  return refs
}
