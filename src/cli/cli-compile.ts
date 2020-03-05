import fs from 'fs'
import path from 'path'
import { parseHTML } from './parse-html'
import { RawTagSchema } from '../common'
import { parseTag } from '../parser/parse-tag'
import { buildTemplate } from '../builder/build-template'

const inputPath = path.resolve(process.argv[2])
const basename = path.basename(inputPath, '.html')
const rawTemplate = fs.readFileSync(path.resolve(inputPath), 'UTF8')

const schema = parseHTML(rawTemplate)
const templateSchema = parseTag(schema as RawTagSchema)
const str = buildTemplate(templateSchema)

const outputFile = path.resolve(basename + '.ts')
fs.writeFileSync(outputFile, str)
