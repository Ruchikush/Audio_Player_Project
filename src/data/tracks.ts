export type Track = {
  id: string;
  title: string;
  artist?: string;
  uri: any; 
  artwork?: any;
};

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Sample Song 1',
    artist: 'Artist 1',
    uri: require('../../assets/audio/song1.mp3'),
    artwork: require('../../assets/images/thumb1.png'),
  },
  {
    id: '2',
    title: 'Sample Song 2',
    artist: 'Artist 2',
    uri: require('../../assets/audio/song2.mp3'),
    artwork: require('../../assets/images/thumb2.png'),
  },
];
