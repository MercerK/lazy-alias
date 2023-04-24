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
                throw new Error('No key provided');
            if (!value)
                throw new Error('No value provided');
            if (isValidPath(value) === false)
                throw new Error('Invalid path provided');
            (0, cache_1.setToCache)(key, path_1.default.resolve(process.cwd(), value));
            break;
        }
        case 'delete': {
            const [key] = argv;
            if (!key)
                throw new Error('No key provided');
            (0, cache_1.removeFromCache)(key);
            break;
        }
        default: {
            const [key, ...rest] = argv;
            const cache = (0, cache_1.readCache)();
            if (!key)
                throw new Error('No key provided');
            if (!cache[command])
                throw new Error('Command not found in cache');
            const target = cache[command];
            const isWindows = process.platform === 'win32';
            let cmd = key;
            if (isWindows) {
                cmd = `${key}.cmd`;
            }
            const child = (0, child_process_1.spawn)(cmd, [...rest], { cwd: target, stdio: 'inherit' });
            child.on('message', (message) => {
                console.log(message);
            });
            child.on('error', (error) => {
                console.error(error.message);
                (0, process_1.exit)(1);
            });
            child.on('exit', (code) => {
                (0, process_1.exit)(code ?? 0);
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
