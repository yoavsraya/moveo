import React, { useEffect, useState } from 'react';
import './songDisplay.css';
import { getSong } from './songsRequests';
import { sendWebSocketMessage } from '../../socket';

const SongDisplay = () => { //live page
  const [songData, setSongData] = useState(null);
  const [instrument, setInstrument] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false); // Track whether auto-scrolling is active
  const [scrollInterval, setScrollInterval] = useState(null); // Track the scrolling

  useEffect(() => {
    const Data = localStorage.getItem('songData');
    if (Data) // if data saved in the local storage
    {
      setSongData(JSON.parse(Data));
    }
    else
    {
      const fetchSongData = async () => {
        try
        {
          const response = await getSong(); //get selected song by admin
          const data = response.data;
          console.log('data:', data.song);
          if (data.song)
          {
            setSongData(data.song);
            localStorage.setItem('songData', JSON.stringify(data.song)); // store the song for refresh and more.
          }
        }
        catch (error) 
        {
          console.error('Error fetching song data:', error);
          //navigate('/');
        }
      };

      fetchSongData();
    }

    const adminStatus = localStorage.getItem('isAdmin'); // check if admin for button
    if (adminStatus === 'true')
    {
      setIsAdmin(true);
    }

    setInstrument(localStorage.getItem('instrument')); // check if it is singer or not

    return () => { //clean up function 
      if (scrollInterval) {
        clearInterval(scrollInterval); 
      }
    };
  }, [scrollInterval]);

  const handleSendMessage = () => {
    sendWebSocketMessage({ action: 'redirect', url: `/` }); // quit button has been push. live ended 
  };

  const toggleScrolling = () => {
    if (isScrolling) {
      clearInterval(scrollInterval); // Stop scrolling
      setScrollInterval(null);
      setIsScrolling(false);
    } else {
      const interval = setInterval(() => {
        window.scrollBy(0, 1); 
      }, 50);
      setScrollInterval(interval);
      setIsScrolling(true);
    }
  };

  if (!songData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="song-display">
      <h1 className="song-name">{songData.songName}</h1>
      <h3 className="song-artist">{songData.artistName}</h3>
      {songData.song && Array.isArray(songData.song) ?
      (
        songData.song.map((line, index) => (
          <div key={index} className="line-wrapper">
            {instrument !== 'singer' && line.chords && ( // if singer upload only lyrics
              <div className="chords">{line.chords}</div>
            )}
            {line.lyrics && <div className="lyrics">{line.lyrics}</div>}
          </div>
        ))
      )
      :
      (
        <div>No song lines available</div>
      )}

      {isAdmin && (
        <button onClick={handleSendMessage} className="admin-button">
          Quit
        </button>
      )}

      {/* Floating toggle button */}
      <button onClick={toggleScrolling} className="play-button">
        <img
          src={'/play.jpg'}
          alt="play button"
          className="play-button-img"
        />
      </button>
    </div>
  );
};

export default SongDisplay;
