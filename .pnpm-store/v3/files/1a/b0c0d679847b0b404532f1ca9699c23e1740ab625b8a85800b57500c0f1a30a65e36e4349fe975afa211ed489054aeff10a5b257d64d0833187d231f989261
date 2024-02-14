'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const WebpackPlugin = require('@unocss/webpack');
const presetUno = require('@unocss/preset-uno');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const WebpackPlugin__default = /*#__PURE__*/_interopDefaultCompat(WebpackPlugin);
const presetUno__default = /*#__PURE__*/_interopDefaultCompat(presetUno);

function UnocssWebpackPlugin(configOrPath) {
  return WebpackPlugin__default(
    configOrPath,
    {
      presets: [
        presetUno__default()
      ]
    }
  );
}

exports.default = UnocssWebpackPlugin;
Object.keys(WebpackPlugin).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) exports[k] = WebpackPlugin[k];
});
