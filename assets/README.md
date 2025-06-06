# Asset Organization Guide

This directory contains all static assets for the Carbon Hub mobile app, organized by type for better maintainability.

## Directory Structure

```
assets/
├── icons/          # App icons, favicons, and small UI icons
│   ├── icon.png           # Main app icon (1024x1024)
│   ├── adaptive-icon.png  # Android adaptive icon foreground
│   └── favicon.png        # Web favicon
├── images/         # General purpose images
│   ├── backgrounds/       # Background images
│   ├── illustrations/     # Illustrations and graphics
│   └── ui/               # UI-specific images
├── logos/          # Company and partner logos
│   ├── carbon-hub/       # Carbon Hub branding assets
│   └── partners/         # Partner company logos
└── splash/         # Splash screen assets
    └── splash-icon.png   # Splash screen image
```

## Best Practices

### Icon Standards
- **App Icon**: 1024x1024 PNG with transparent background
- **Adaptive Icon**: 1024x1024 PNG for Android foreground layer
- **Favicon**: 32x32 or 16x16 PNG for web

### Image Guidelines
- Use **WebP** format for better compression when possible
- Provide **@2x and @3x** variants for different screen densities
- Keep file sizes optimized (< 500KB for most images)
- Use consistent naming: `background-home.png`, `illustration-carbon-cycle.png`

### Logo Requirements
- Always include **SVG** versions when available
- Provide light and dark theme variants
- Include horizontal and vertical orientations
- Follow brand guidelines for minimum sizes and clear space

### File Naming Convention
- Use **kebab-case**: `carbon-footprint-chart.png`
- Include size suffixes: `logo-horizontal-light@2x.png`
- Be descriptive: `background-emissions-dashboard.png`

### Splash Screen
- Minimum 1242x2436 for iPhone compatibility
- Use company branding colors as background
- Keep loading icon/logo centered

## Usage in Code

### Importing Assets
```javascript
// For icons and small images
import AppIcon from '../assets/icons/icon.png';

// For illustrations and backgrounds
import BackgroundImage from '../assets/images/backgrounds/dashboard-bg.png';

// For logos
import CarbonHubLogo from '../assets/logos/carbon-hub/logo-horizontal.png';
```

### Dynamic Asset Loading
```javascript
// Using expo-asset for preloading
import { Asset } from 'expo-asset';

const preloadAssets = async () => {
  const images = [
    require('../assets/images/illustrations/carbon-cycle.png'),
    require('../assets/logos/carbon-hub/logo.png'),
  ];
  
  await Asset.loadAsync(images);
};
```

## Platform-Specific Considerations

### iOS
- Use **App Transport Security** compliant images
- Support **Dark Mode** variants when applicable
- Follow **Human Interface Guidelines** for icon design

### Android
- Provide **adaptive icons** for Android 8.0+
- Use **vector drawables** when possible
- Support **Material Design** principles

### Web
- Include **PWA** icons in various sizes
- Optimize for **fast loading** with compressed formats
- Provide **high-DPI** variants for retina displays

## Maintenance

- Review and optimize assets quarterly
- Remove unused assets during major releases
- Update brand assets when company guidelines change
- Monitor bundle size impact of new assets

---

*Last updated: 2024* 