import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMedia } from '@/contexts/MediaContext';
import { X, Download, Share2 } from 'lucide-react-native';
import { Video } from 'expo-av';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';

export default function VideoPreviewScreen() {
  const { mediaId } = useLocalSearchParams();
  const { media, updateMedia } = useMedia();
  const router = useRouter();
  const [sharing, setSharing] = useState(false);

  const mediaItem = media.find(m => m.id === mediaId);

  if (!mediaItem || mediaItem.type !== 'video') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Video not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSave = () => {
    updateMedia(mediaItem.id, {
      editedUri: mediaItem.uri,
    });
    router.back();
  };

  const handleShare = async () => {
    try {
      setSharing(true);
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(mediaItem.uri, {
          mimeType: 'video/mp4',
          dialogTitle: 'Share your video',
        });
      }
    } catch (error) {
      console.error('Error sharing video:', error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Preview</Text>
        <View style={styles.headerButton} />
      </View>

      <View style={styles.videoContainer}>
        <Video
          source={{ uri: mediaItem.uri }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          isLooping
          shouldPlay
        />
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSave}
        >
          <Download size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Save Video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={handleShare}
          disabled={sharing}
        >
          <Share2 size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>
            {sharing ? 'Sharing...' : 'Share Video'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerButton: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  actionsContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
  },
  shareButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
