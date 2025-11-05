import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMedia } from '@/contexts/MediaContext';
import { X, Download, RotateCw, Palette, Share2 } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import * as Sharing from 'expo-sharing';

type FilterType = 'none' | 'grayscale' | 'sepia' | 'vibrant';

export default function EditPhotoScreen() {
  const { mediaId } = useLocalSearchParams();
  const { media, updateMedia } = useMedia();
  const router = useRouter();

  const mediaItem = media.find(m => m.id === mediaId);

  const [brightness, setBrightness] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState<FilterType>('none');
  const [activeTab, setActiveTab] = useState<'filters' | 'adjust'>('filters');
  const [sharing, setSharing] = useState(false);

  if (!mediaItem || mediaItem.type !== 'photo') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Photo not found</Text>
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
          mimeType: 'image/jpeg',
          dialogTitle: 'Share your photo',
        });
      }
    } catch (error) {
      console.error('Error sharing photo:', error);
    } finally {
      setSharing(false);
    }
  };

  const rotate = () => {
    setRotation((rotation + 90) % 360);
  };

  const getFilterStyle = () => {
    let tintColor = undefined;

    if (filter === 'grayscale') {
      tintColor = '#888888';
    } else if (filter === 'sepia') {
      tintColor = '#704214';
    } else if (filter === 'vibrant') {
      return {
        width: '100%',
        height: '100%',
      };
    }

    return {
      width: '100%',
      height: '100%',
      tintColor,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <X size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Photo</Text>
        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
          <Download size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: mediaItem.uri }}
          style={[
            styles.image,
            {
              transform: [{ rotate: `${rotation}deg` }],
              opacity: brightness,
            },
            getFilterStyle(),
          ]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.toolButton, activeTab === 'filters' && styles.activeToolButton]}
            onPress={() => setActiveTab('filters')}
          >
            <Palette size={24} color={activeTab === 'filters' ? '#007AFF' : '#000000'} />
            <Text style={[styles.toolText, activeTab === 'filters' && styles.activeToolText]}>Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolButton, activeTab === 'adjust' && styles.activeToolButton]}
            onPress={() => setActiveTab('adjust')}
          >
            <Palette size={24} color={activeTab === 'adjust' ? '#007AFF' : '#000000'} />
            <Text style={[styles.toolText, activeTab === 'adjust' && styles.activeToolText]}>Adjust</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton} onPress={rotate}>
            <RotateCw size={24} color="#000000" />
            <Text style={styles.toolText}>Rotate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={handleShare}
            disabled={sharing}
          >
            <Share2 size={24} color="#000000" />
            <Text style={styles.toolText}>{sharing ? 'Sharing...' : 'Share'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.editPanel}>
        {activeTab === 'filters' && (
          <View style={styles.filtersContainer}>
            <Text style={styles.panelTitle}>Filters</Text>
            <Text style={styles.filterNote}>Tap a filter to apply it to your photo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {(['none', 'grayscale', 'sepia', 'vibrant'] as FilterType[]).map(f => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterButton, filter === f && styles.activeFilter]}
                  onPress={() => setFilter(f)}
                >
                  <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === 'adjust' && (
          <View style={styles.adjustContainer}>
            <Text style={styles.panelTitle}>Brightness</Text>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={1.5}
              value={brightness}
              onValueChange={setBrightness}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#E5E5EA"
            />
          </View>
        )}
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  toolbar: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  toolButton: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  activeToolButton: {
    backgroundColor: '#F2F2F7',
  },
  toolText: {
    fontSize: 12,
    color: '#000000',
    marginTop: 4,
  },
  activeToolText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  editPanel: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    minHeight: 150,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
  },
  filtersContainer: {
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#000000',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filterNote: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 10,
  },
  filterScroll: {
    paddingRight: 20,
  },
  adjustContainer: {
    gap: 15,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
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
