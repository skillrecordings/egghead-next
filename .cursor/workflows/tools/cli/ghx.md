# How to Use the `ghx` CLI for GitHub Code Search

**Your task: When you need to find code examples, files, or specific patterns on GitHub, use the `ghx` command-line tool. This document provides its usage instructions and examples.**

## `ghx` Command Reference

Find examples of files, code, etc on GitHub

Usage: ghx [options]

Commands:
ghx config Manage configuration settings
ghx [query] Search GitHub Code [default]

Positionals:
query Search query [string]

Options:
--version Show version number [boolean]
-h, --help Show help [boolean]
-p, --pipe Output results directly to stdout [boolean]
-d, --debug Output code fence contents for testing [boolean]
-L, --limit Maximum number of results to fetch [number] [default: 50]
-f, --max-filename Maximum length of generated filenames
[number] [default: 50]
-c, --context Number of context lines around matches
[number] [default: 20]
-r, --repo Search in a specific repository (owner/repo) [string]
-P, --path Search in a specific path [string]
-l, --language Search for files in a specific language [string]
-e, --extension Search for files with a specific extension [string]
-n, --filename Search for files with a specific name [string]
-s, --size Search for files of a specific size [string]
-F, --fork Include or exclude forked repositories [boolean]

Examples:
ghx 'useState' Search for 'useState' across all ind
exed code on GitHub
ghx --repo facebook/react "useState" Search for 'useState' in the faceboo
k/react repository
ghx -l typescript -e tsx "useState" Search for 'useState' in TypeScript
files with the .tsx extension
ghx -n package.json "dependencies" Search for 'dependencies' specifical
ly within package.json files
ghx -P src/components "Button" Search for 'Button' within the src/c
omponents path
ghx -s '">10000" -l go "package main" Search for 'package main' in Go file
s larger than 10KB
ghx "async function" -l typescript Search for the exact phrase 'async f
unction' in TypeScript files
ghx "my search terms" --pipe > results.m Search and pipe the results directly
d to a markdown file
ghx -L 100 -c 30 "complex query" Fetch up to 100 results with 30 line
s of context per match
ghx -l typescript "import test" Search for lines containing both 'im
port' AND 'test' in TypeScript files
ghx -l javascript "const OR let" Search for lines containing either '
const' OR 'let' in JavaScript files
ghx -l css "color NOT background-color" Search for lines containing 'color'
BUT NOT 'background-color' in CSS fi
les

**REMEMBER: Refer to these instructions and examples when constructing `ghx` commands to perform targeted and effective GitHub code searches.**
