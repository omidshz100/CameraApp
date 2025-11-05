import React, { createContext, useContext, useState, useCallback } from 'react';
import { Media } from '@/types/media';

interface MediaContextType {
  media: Media[];
  addMedia: (media: Media) => void;
  deleteMedia: (id: string) => void;
  updateMedia: (id: string, updates: Partial<Media>) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [media, setMedia] = useState<Media[]>([]);

  const addMedia = useCallback((newMedia: Media) => {
    setMedia(prev => [newMedia, ...prev]);
  }, []);

  const deleteMedia = useCallback((id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
  }, []);

  const updateMedia = useCallback((id: string, updates: Partial<Media>) => {
    setMedia(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  return (
    <MediaContext.Provider value={{ media, addMedia, deleteMedia, updateMedia }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within MediaProvider');
  }
  return context;
}
