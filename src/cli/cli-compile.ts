import fs from 'fs'
import path from 'path'
import { parseHTML } from './parse-html'
import { RawSchema } from '../common'
import { parseTemplate } from '../parser/parse-template'
import { buildTemplate } from '../builder/build-template'

const inputPath = path.resolve(process.argv[2])
const basename = path.basename(inputPath, '.html')
const rawTemplate = fs.readFileSync(path.resolve(inputPath), 'UTF8')

const schema = parseHTML(rawTemplate)
const templateSchema = parseTemplate(schema as unknown as RawSchema[])
const str = buildTemplate(templateSchema)

const outputFile = path.resolve(basename + '.ts')
fs.writeFileSync(outputFile, str)
