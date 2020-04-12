#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { parseHTML } from './parse-html'
import {
  RawTagSchema,
  TagSchema
} from '../common'
import { parseTag } from '../parser/parse-tag'
import { buildTemplate } from '../builder/build-template'

const inputPath = path.resolve(process.argv[2])
const basename = path.basename(inputPath, '.html')
const basedir = path.dirname(inputPath)
const rawTemplate = fs.readFileSync(inputPath, 'UTF8')

const schema = parseHTML(rawTemplate)
const templateSchema = parseTag(schema as RawTagSchema)
const str = buildTemplate(templateSchema.children[0] as TagSchema)

fs.writeFileSync(path.resolve(basedir, basename + '.ts'), str)
