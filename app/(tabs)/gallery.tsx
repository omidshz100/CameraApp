import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image as RNImage, Dimensions } from 'react-native';
import { useMedia } from '@/contexts/MediaContext';
import { useRouter } from 'expo-router';
import { Play, Trash2 } from 'lucide-react-native';
import { Media } from '@/types/media';

const { width } = Dimensions.get('window');
const numColumns = 3;
const imageSize = (width - 40) / numColumns;

export default function GalleryScreen() {
  const { media, deleteMedia } = useMedia();
  const router = useRouter();

  const handleMediaPress = (item: Media) => {
    if (item.type === 'photo') {
      router.push({
        pathname: '/edit-photo',
        params: { mediaId: item.id },
      });
    } else {
      router.push({
        pathname: '/edit-video',
        params: { mediaId: item.id },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteMedia(id);
  };

  const renderItem = ({ item }: { item: Media }) => (
    <TouchableOpacity
      style={styles.mediaItem}
      onPress={() => handleMediaPress(item)}
    >
      <RNImage
        source={{ uri: item.type === 'video' && item.thumbnail ? item.thumbnail : item.uri }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      {item.type === 'video' && (
        <View style={styles.videoOverlay}>
          <Play size={32} color="#FFFFFF" />
        </View>
      )}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Trash2 size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (media.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No photos or videos yet</Text>
        <Text style={styles.emptySubtext}>Start capturing memories!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gallery</Text>
        <Text style={styles.headerSubtitle}>{media.length} items</Text>
      </View>
      <FlatList
        data={media}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  grid: {
    padding: 10,
  },
  mediaItem: {
    width: imageSize,
    height: imageSize,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F2F2F7',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
