// @ts-expect-error regenerate has no type def
import regenerate from 'regenerate'
import {outputFileSync} from 'fs-extra'
import minimist from 'minimist'

function main(args: minimist.ParsedArgs) {
  const set = regenerate().add(
    require('@unicode/unicode-13.0.0/Binary_Property/Pattern_White_Space/code-points.js')
  )
  outputFileSync(
    args.outFile,
    `// @generated from regex-gen.ts
export const WHITE_SPACE_REGEX = /${set.toString()}/i`
  )
}

if (require.main === module) {
  main(minimist(process.argv))
}
