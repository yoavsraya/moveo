import React from 'react';
import './songList.css';

const SongList = ({ songs, onSongSelect }) => {
  return (
    <div className="song-list">
      {songs.map((song, index) => (
        <div 
          key={index} 
          className="song-item" 
          onClick={() => onSongSelect(song)}
        >
          <div className="song-name">{song.songName}</div>
          <div className="artist-name">{song.artistName}</div>
        </div>
      ))}
    </div>
  );
};

export default SongList;