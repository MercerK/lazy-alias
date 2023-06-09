"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const cache_1 = require("./cache");
const [command, ...argv] = process.argv.slice(2);
const isValidPath = (path) => {
    try {
        fs_1.default.accessSync(path, fs_1.default.constants.R_OK);
        return true;
    }
    catch (error) {
        return false;
    }
};
const main = () => {
    switch (command.toLowerCase()) {
        case 'set': {
            const [key, value] = argv;
            if (!key)
                throw new Error('No alias provided');
            if (!value)
                throw new Error('No path provided');
            if (isValidPath(value) === false)
                throw new Error('Invalid path provided');
            (0, cache_1.setToCache)(key, path_1.default.resolve(process.cwd(), value));
            break;
        }
        case 'delete': {
            const [key] = argv;
            if (!key)
                throw new Error('No alias provided');
            (0, cache_1.removeFromCache)(key);
            break;
        }
        case 'list': {
            const cache = (0, cache_1.readCache)();
            const keys = Object.keys(cache);
            console.log('Lazy Aliases:');
            if (keys.length === 0) {
                console.log('- No aliases');
                break;
            }
            for (const key of keys) {
                console.log(`- ${key}: ${cache[key]}`);
            }
            break;
        }
        default: {
            const [...rest] = argv;
            const cache = (0, cache_1.readCache)();
            if (!cache[command])
                throw new Error('Alias not found');
            const target = cache[command];
            const isWindows = process.platform === 'win32';
            let cmd = '';
            if (isWindows) {
                cmd = `powershell.exe`;
            }
            else {
                cmd = `bash`;
            }
            const fullCommand = `${[...rest].join(' ')}`;
            (0, child_process_1.execSync)(fullCommand, {
                cwd: target,
                env: process.env,
                stdio: 'inherit',
            });
            break;
        }
    }
};
try {
    main();
}
catch (error) {
    if (error instanceof Error) {
        console.error(error.message);
    }
    else {
        console.error(error);
    }
    (0, process_1.exit)(1);
}
