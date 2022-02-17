import fs from 'fs';
import path from 'path';
import { parseComponent } from '../parser/parse-component';
const inputPath = path.resolve(process.argv[2]);

const data = fs.readFileSync(inputPath, { encoding: 'utf8', flag: 'r' });
const parsed = parseComponent(data);
const pretty = JSON.stringify(parsed, null, 2);
process.stdout.write(pretty);
