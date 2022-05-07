import fs from 'fs';
import { program } from 'commander';
import path from 'path';
import { getEntriesFromZipfile, sortEntries } from './parser.js';

program
    .requiredOption('-i, --input <file>', 'Input file')
    .option('-r, --remove-duplicates', 'Filter out duplicate entries', false)
    .option('-s, --sort [field]', 'Sort by field')
    .option('-d, --desc', 'Change sort direction to descending (does nothing without [sort])', false)
    .option('-o, --output <file>', 'Output file', `outputs/output.json`)
    .option('--delimiter [delimiter]', 'Delimiter to use', '||');

program.parse(process.argv);

const options = program.opts();
const {
    input,
    sort,
    desc,
    output,
} = options;

async function main() {
    const entries = sortEntries(await getEntriesFromZipfile(input, options), sort, desc);

    try {
        const outputFile = path.resolve(output);
        const dir = path.dirname(outputFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(
            outputFile,
            JSON.stringify(entries, null, 2),
        );
    } catch (err) {
        console.error(err)
    }
}

main();