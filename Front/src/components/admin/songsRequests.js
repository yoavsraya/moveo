import axios from 'axios';

export const searchSongs = async (i_search) =>
{
    const response = await axios.get(`http://localhost:3000/songsList`, { params: { q: i_search } });
    console.log('searchSongs:', response.data);
    return response.data;
}

export const getLyricsAndChords = async (i_link) =>
    {
        console.log('Fetching song data from:', i_link);
        const response = await axios.get(`http://localhost:3000/chords-lyrics`, { params: { url: i_link } });
        return response.data;
    }

export const postSong = async (songName, songArtist, i_songData) =>
{
    console.log('sending song data...');
    const response = await axios.post('http://localhost:3000/postsong', {
        songName: songName,
        artistName: songArtist,
        song: i_songData
    });
    return response;
}

export const getSong = async () =>
    {
        console.log('asking for song');
        const response = await axios.get('http://localhost:3000/getsong');
        console.log('response:', response);
        return response;
    }