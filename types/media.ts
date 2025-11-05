export type MediaType = 'photo' | 'video';

export interface Media {
  id: string;
  uri: string;
  type: MediaType;
  thumbnail?: string;
  duration?: number;
  createdAt: Date;
  editedUri?: string;
}
