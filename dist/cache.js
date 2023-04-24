"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCache = exports.setToCache = exports.readCache = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const cachePath = path_1.default.join(__dirname, '../cache.json');
const readCache = () => {
    if ((0, fs_1.existsSync)(cachePath) === false) {
        return {};
    }
    const cache = (0, fs_1.readFileSync)(cachePath, 'utf-8');
    return JSON.parse(cache);
};
exports.readCache = readCache;
const writeCache = (cache) => {
    const cacheString = JSON.stringify(cache);
    (0, fs_1.writeFileSync)(cachePath, cacheString, 'utf-8');
};
const setToCache = (key, value) => {
    const cache = (0, exports.readCache)();
    cache[key] = value;
    writeCache(cache);
};
exports.setToCache = setToCache;
const removeFromCache = (key) => {
    const cache = (0, exports.readCache)();
    delete cache[key];
    writeCache(cache);
};
exports.removeFromCache = removeFromCache;
