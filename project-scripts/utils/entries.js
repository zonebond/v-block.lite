const path = require('path');

const entries = {};

Object.defineProperty(entries, 'base_path', {
  get: () => {
    return path.resole('./src');
  }
});

Object.defineProperty(entries, 'points', {
  get: () => {
    return ['common', 'library', 'layout'];
  }
});

module.exports = entries;