import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import {searchSongs , getLyricsAndChords , postSong} from './songsRequests';
import SongList from './songList';
import { sendWebSocketMessage } from '../../socket';

const AdminHomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => { //sending serach Qurey
    if (searchQuery.trim() !== '')
    {
      setIsSearching(true); // to present the song list
      console.log('searching for:', searchQuery);
      const results = await searchSongs(searchQuery); //sending the search query to the server
      setSearchResults(results); //set the result.
    }
  };

  const handleSongSelect = async (song) => { //after song selected, get song and announce all
    const songData = await getLyricsAndChords(song.songLink); //get song data
    console.log('songData:', songData);
    
    try {
      const response = await postSong(song.songName, song.artistName, songData); // psot the song in the server
      console.log('response:', response);
    }

    catch (error)
    {
      console.error('Error updating song data:', error);
    }
    setTimeout(() =>
    {
      const randomNumber = Math.floor(Math.random() * 9000) + 1000; // create session id
    sendWebSocketMessage({ action: 'redirect', url: `/live?sessionId=${randomNumber}`}); //announce all to move to the live page
    }, 1000);
    
  };

  return (
    <div className="container">
      <div className="content-box">
        <h1>Search any song...</h1>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter song or artist"
        />
        <button onClick={handleSearch}>Search</button>

        {isSearching && searchResults.length > 0 && (
          <SongList songs={searchResults} onSongSelect={handleSongSelect} />
        )}
      </div>
    </div>
  );
};

export default AdminHomePage;