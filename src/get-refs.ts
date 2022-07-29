import { findAllPackagesInfo } from './find-all-packages'
import { packageInfoUtils } from './package-info-utils'

export interface Ref {
  [name: string]: {
    title: string
    url: string
  }
}

export function getRefs(cb?: (ref: Ref) => Ref) {
  const cwd = process.env.__BOOKCASE_BUILDER_ROOT__ as string
  const refs = findAllPackagesInfo({ valid: true, cwd })
    .reduce<Ref>((prev, info) => {
      const { basename, basePath } = packageInfoUtils(info, cwd)

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
