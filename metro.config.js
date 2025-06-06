const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add resolver for web dependencies
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.alias = {
  'react-native$': 'react-native-web',
};

// Ensure react-native-reanimated is properly handled
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = withNativeWind(config, { input: './global.css' }); 