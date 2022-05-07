# Zipped CSV to JSON parser

Node application to take a zip file containing CSVs and transform to a JSON file containing the formatted records.

## Installation and Usage

### Dependencies
Install the dependencies with
```
npm ci
```

### Basic Usage
```
npm start -- -i /path/to/input.zip
```

This creates a json file under `outputs/output.json` by default.

### Advanced Usage

#### Summary
```
Options:
  -i, --input <file>       Input file
  -r, --remove-duplicates  Filter out duplicate entries (default: false)
  -s, --sort [field]       Sort by field
  -d, --desc               Change sort direction to descending (does nothing without [sort]) (default: false)
  -o, --output <file>      Output file (default: "outputs/output.json")
  --delimiter [delimiter]  Delimiter to use (default: "||")
  -h, --help               display help for command
```

#### Removing duplicates (default: disabled)
```
npm start -- -i /path/to/input.zip --remove-duplicates
```
This makes each entry unique (based on all fields)

#### Sorting (default: not sorted)
```
npm start -- -i /path/to/input.zip --sort name
```
This sorts the entries via the selected field provided that it's valid

#### Sort descending (default: false)
```
npm start -- -i /path/to/input.zip --sort name --desc
```
Reverses the sort direction to descending

#### Custom output location (default: `outputs/output.json`)
```
npm start -- -i /path/to/input.zip --output /path/to/output.json
```
Changes the location and filename where the output file will be saved

#### Custom delimiter (default: `||`)
```
npm start -- -i /path/to/input.zip --delimiter ,
```
Changes the delimiter to a different one if needed
