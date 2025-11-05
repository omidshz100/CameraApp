# Camera App

A React Native camera application built with Expo that allows users to capture photos and videos, edit them with filters and adjustments, and share their media.

## Features

### 📸 Camera Functionality
- Take high-quality photos
- Record videos with up to 60-second duration
- Switch between front and rear cameras
- Real-time recording indicator
- Camera and microphone permission handling

### 🖼️ Photo Editing
- Apply filters (Grayscale, Sepia, Vibrant)
- Adjust brightness with slider control
- Rotate photos in 90-degree increments
- Real-time preview of edits

### 🎥 Video Preview
- Full-screen video playback with native controls
- Loop playback functionality
- Video sharing capabilities

### 📱 Gallery Management
- Grid view of all captured media
- Thumbnail previews for videos
- Delete media functionality
- Media type indicators
- Empty state handling

### 🔄 Media Sharing
- Share photos and videos to other apps
- Platform-appropriate sharing dialogs
- Async sharing with loading states

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router with file-based routing
- **State Management**: React Context API
- **UI Components**: React Native core components
- **Icons**: Lucide React Native
- **Media Handling**: Expo AV, Expo Camera, Expo Media Library

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for development)
- Physical device (recommended for camera testing)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CameraApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open the app:
   - Scan the QR code with Expo Go app on your device
   - Use iOS Simulator or Android Emulator

## Project Structure

```
app/
├── (tabs)/                 # Tab-based navigation
│   ├── _layout.tsx        # Tab layout configuration
│   ├── index.tsx          # Camera screen (main tab)
│   └── gallery.tsx        # Gallery screen
├── _layout.tsx            # Root layout with providers
├── edit-photo.tsx         # Photo editing modal
└── edit-video.tsx         # Video preview modal

contexts/
└── MediaContext.tsx       # Global media state management

types/
└── media.ts              # TypeScript type definitions

hooks/
└── useFrameworkReady.ts  # Framework initialization hook

assets/
└── images/               # App icons and images
```

## Key Components

### [`MediaContext`](contexts/MediaContext.tsx)
Global state management for media items with CRUD operations:
- `addMedia()` - Add new photo/video
- `deleteMedia()` - Remove media item
- `updateMedia()` - Update media properties

### [`Media`](types/media.ts) Type Definition
```typescript
interface Media {
  id: string;
  uri: string;
  type: MediaType;
  thumbnail?: string;
  duration?: number;
  createdAt: Date;
  editedUri?: string;
}
```

## Scripts

- `npm run dev` - Start development server
- `npm run build:web` - Build for web platform
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Permissions

The app requires the following permissions:
- **Camera**: To capture photos and videos
- **Microphone**: To record audio with videos
- **Media Library**: To save and access media files

## Platform Support

- ✅ iOS
- ✅ Android
- ⚠️ Web (limited - camera not available)

## Dependencies

### Core
- [`expo`](package.json) - Expo SDK
- [`react-native`](package.json) - React Native framework
- [`expo-router`](package.json) - File-based navigation

### Camera & Media
- [`expo-camera`](package.json) - Camera functionality
- [`expo-av`](package.json) - Audio/video playback
- [`expo-media-library`](package.json) - Media library access
- [`expo-video-thumbnails`](package.json) - Video thumbnail generation

### UI & Utilities
- [`lucide-react-native`](package.json) - Icon library
- [`@react-native-community/slider`](package.json) - Slider component
- [`expo-sharing`](package.json) - Native sharing functionality

## Development Notes

### Camera Limitations
- Camera functionality is not available on web platform
- Physical device recommended for testing camera features
- Video recording limited to 60 seconds maximum

### State Management
- Uses React Context for global media state
- Media items stored in memory (not persisted)
- Consider implementing persistent storage for production

### File Structure
- Follows Expo Router file-based routing conventions
- Modal screens for editing functionality
- Shared components could be extracted to separate directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is private and proprietary.

## Troubleshooting

### Common Issues

**Camera not working:**
- Ensure physical device is used for testing
- Check camera permissions are granted
- Restart the app if camera appears frozen

**Build errors:**
- Clear Expo cache: `expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Expo SDK compatibility

**TypeScript errors:**
- Run type checking: `npm run typecheck`
- Ensure all imports have proper file extensions
- Check TypeScript configuration in [`tsconfig.json`](tsconfig.json)

For more help, refer to the [Expo documentation](https://docs.expo.dev/).