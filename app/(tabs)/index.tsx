import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { Video, Play, StopCircle, FlipHorizontal } from 'lucide-react-native';
import { useMedia } from '@/contexts/MediaContext';
import { Media } from '@/types/media';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const cameraRef = useRef<any>(null);
  const { addMedia } = useMedia();

  if (!cameraPermission || !microphonePermission) {
    return <View style={styles.container} />;
  }

  if (!cameraPermission.granted || !microphonePermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera and microphone
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => {
            if (!cameraPermission.granted) requestCameraPermission();
            if (!microphonePermission.granted) requestMicrophonePermission();
          }}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });

      const newMedia: Media = {
        id: Date.now().toString(),
        uri: photo.uri,
        type: 'photo',
        createdAt: new Date(),
      };

      addMedia(newMedia);
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current || isRecording || !isCameraReady) return;

    try {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync({
        maxDuration: 60,
      });

      let thumbnail: string | undefined;

      const newMedia: Media = {
        id: Date.now().toString(),
        uri: video.uri,
        type: 'video',
        thumbnail,
        createdAt: new Date(),
      };

      addMedia(newMedia);
      setIsRecording(false);
    } catch (error) {
      console.error('Error recording video:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.webWarning}>Camera is not available on web platform</Text>
        <Text style={styles.webWarningSubtext}>Please use this app on iOS or Android</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}
        mode="video"
      >
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <FlipHorizontal size={32} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              disabled={isRecording || !isCameraReady}
            >
              <View style={[styles.captureButtonInner, (isRecording || !isCameraReady) && styles.disabled]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordingButton]}
              onPress={isRecording ? stopRecording : startRecording}
              disabled={!isCameraReady}
            >
              {isRecording ? (
                <StopCircle size={32} color="#FFFFFF" />
              ) : (
                <Video size={32} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>

      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>Recording</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  permissionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  controlsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
  },
  flipButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderRadius: 30,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  disabled: {
    opacity: 0.5,
  },
  recordButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  recordingButton: {
    backgroundColor: '#FF9500',
  },
  recordingIndicator: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  webWarning: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 40,
  },
  webWarningSubtext: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
