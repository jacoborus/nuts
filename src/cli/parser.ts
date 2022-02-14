import fs from 'fs';
import path from 'path';
import { parseHTML } from './parse-html';
const inputPath = path.resolve(process.argv[2]);

const data = fs.readFileSync(inputPath, { encoding: 'utf8', flag: 'r' });
const schema = parseHTML(data);
console.log(JSON.stringify(schema, null, 2));
