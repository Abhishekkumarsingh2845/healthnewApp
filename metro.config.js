const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchOptions: {
    ignored: /node_modules/, // Ignore node_modules to reduce file watchers
    poll: 1000, // Adjust polling interval (in milliseconds)
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
