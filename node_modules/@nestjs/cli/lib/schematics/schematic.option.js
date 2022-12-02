"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchematicOption = void 0;
const formatting_1 = require("../utils/formatting");
class SchematicOption {
    constructor(name, value, keepInputNameFormat = false) {
        this.name = name;
        this.value = value;
        this.keepInputNameFormat = keepInputNameFormat;
    }
    toCommandString() {
        if (typeof this.value === 'string') {
            if (this.name === 'name') {
                return `--${this.name}=${this.format()}`;
            }
            else if (this.name === 'version' || this.name === 'path') {
                return `--${this.name}=${this.value}`;
            }
            else {
                return `--${this.name}="${this.value}"`;
            }
        }
        else if (typeof this.value === 'boolean') {
            const str = this.keepInputNameFormat
                ? this.name
                : (0, formatting_1.normalizeToKebabOrSnakeCase)(this.name);
            return this.value ? `--${str}` : `--no-${str}`;
        }
        else {
            return `--${(0, formatting_1.normalizeToKebabOrSnakeCase)(this.name)}=${this.value}`;
        }
    }
    format() {
        return (0, formatting_1.normalizeToKebabOrSnakeCase)(this.value)
            .split('')
            .reduce((content, char) => {
            if (char === '(' || char === ')' || char === '[' || char === ']') {
                return `${content}\\${char}`;
            }
            return `${content}${char}`;
        }, '');
    }
}
exports.SchematicOption = SchematicOption;
