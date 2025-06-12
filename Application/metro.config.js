const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ajoute des alias et des extensions si nécessaire
config.resolver.assetExts.push('ttf', 'mp4', 'png');
config.resolver.sourceExts.push('cjs');

// This is the new line you should add in, after the previous lines
config.resolver.unstable_enablePackageExports = false;
module.exports = config;
