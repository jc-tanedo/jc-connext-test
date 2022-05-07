import formatters from './formatters.js';
import fs from 'fs';
import JSZip from 'jszip';
import { parse } from 'csv-parse';

const wantedFields = [
    'name',
    'phone',
    'person',
    'amount',
    'date',
    'costCenterNum',
];

export async function getZipEntries(filePath) {
    const file = await new Promise((res, rej) => fs.readFile(filePath, (err, data) => err ? rej(err) : res(data)));
    return await JSZip.loadAsync(file);
}

export async function getCsvEntries(file, delimiter) {
    const data = await file.async('string');
    return parse(data, { columns: true, delimiter });
}

export function formatEntry(rawEntry) {
    return wantedFields.reduce((result, entry) => {
        result[entry] = formatters[entry](rawEntry)
        return result;
    }, {});
}

function getResultObject(removeDuplicates) {
    return removeDuplicates
        ? new Set()
        : [];
}

function addEntry(result, entry, removeDuplicates) {
    if (removeDuplicates) {
        result.add(JSON.stringify(entry));
    } else {
        result.push(entry);
    }

    return result;
}

function getResultJson(result, removeDuplicates) {
    if (removeDuplicates) {
        return Array.from(result).map(JSON.parse);
    } else {
        return result;
    }
}

export function sortEntries(entries, field, descending) {
    if (field && wantedFields.includes(field)) {
        return entries.sort((a, b) => {
            if (isNaN(a[field])) {
                return descending
                    ? b[field].localeCompare(a[field])
                    : a[field].localeCompare(b[field]);
            } else {
                return descending
                    ? b[field] - a[field]
                    : a[field] - b[field];
            }
        })
    }

    if (field) {
        console.warn(`Field ${field} is not a valid field, skipping sort`);
    }

    return entries;
}

export async function getEntriesFromZipfile(file, options) {
    if (!fs.existsSync(file)) {
        console.error(`File ${file} does not exist`);
        return [];
    }

    const entries = await getZipEntries(file);
    let result = getResultObject(options.removeDuplicates);

    for (const file of Object.values(entries.files)) {
        const parsed = await getCsvEntries(file, options.delimiter);

        for await (const record of parsed) {
            result = addEntry(result, formatEntry(record), options.removeDuplicates);
        }
    }

    return getResultJson(result, options.removeDuplicates);
}

export default getEntriesFromZipfile;
