import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './songDisplay.css';
import { getSong } from './songsRequests';
import { sendWebSocketMessage } from '../../socket';

const SongDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [songData, setSongData] = useState(null);
  const [instrument, setInstrument] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false); // Track whether auto-scrolling is active
  const [scrollInterval, setScrollInterval] = useState(null); // Track the scrolling interval

  useEffect(() => {
    const Data = localStorage.getItem('songData');
    if (Data) {
      setSongData(JSON.parse(Data));
      console.log('songData from the storage:', JSON.parse(Data));
    } else {
      const fetchSongData = async () => {
        try {
          const response = await getSong();
          const data = response.data;
          console.log('data:', data.song);
          if (data.song) {
            setSongData(data.song);
            localStorage.setItem('songData', JSON.stringify(data.song));
            console.log('No song data available, redirecting...');
            //navigate('/');
          }
        } catch (error) {
          console.error('Error fetching song data:', error);
          //navigate('/');
        }
      };

      fetchSongData();
    }

    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }

    setInstrument(localStorage.getItem('instrument'));

    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval); // Cleanup the interval when component unmounts
      }
    };
  }, [scrollInterval]);

  const handleSendMessage = () => {
    sendWebSocketMessage({ action: 'redirect', url: `/` });
  };

  const toggleScrolling = () => {
    if (isScrolling) {
      clearInterval(scrollInterval); // Stop scrolling
      setScrollInterval(null);
      setIsScrolling(false);
    } else {
      // Start slow scrolling
      const interval = setInterval(() => {
        window.scrollBy(0, 1); // Scroll down by 1 pixel every 50 milliseconds
      }, 50);
      setScrollInterval(interval);
      setIsScrolling(true);
    }
  };

  if (!songData) {
    return <div>Loading...</div>;
  }

  // If songData is valid, render it
  return (
    <div className="song-display">
      <h1 className="song-name">{songData.songName}</h1>
      <h3 className="song-artist">{songData.artistName}</h3>
      {songData.song && Array.isArray(songData.song) ? (
        songData.song.map((line, index) => (
          <div key={index} className="line-wrapper">
            {instrument !== 'singer' && line.chords && (
              <div className="chords">{line.chords}</div>
            )}
            {line.lyrics && <div className="lyrics">{line.lyrics}</div>}
          </div>
        ))
      ) : (
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
