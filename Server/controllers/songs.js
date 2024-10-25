const axios = require('axios');
const cheerio = require('cheerio');

exports.GETsearchList = async (req, res) => {
    const query = req.query.q;
    if (!query) 
    {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try
    {
        const searchResults = await searchSong(query);
        res.json(searchResults); 
    }
    catch (error)
    {
        res.status(500).json({ error: 'Error fetching search results' });
    }

}

exports.GETchordAndLyrics = async (req, res) => {
    const songUrl = req.query.url; 

    if (!songUrl) {
        return res.status(400).json({ error: 'Query parameter "url" is required' });
    }

    try 
    {
        const chordsAndLyrics = await getLyricsAndChords(songUrl);
        res.json(chordsAndLyrics); 
    } 
    catch (error)
    {
        res.status(500).json({ error: 'Error fetching chords and lyrics' });
    }
}

async function getLyricsAndChords(songUrl) {
    try {
        console.log('Fetching song data from:', songUrl);
        const response = await axios.get(songUrl);
        const $ = cheerio.load(response.data);
        const lines = [];
    
        let currentChordLine = '';
        let currentLyricLine = '';
        let index = 0;
    
        // Use while loop to control the iteration and skip every second element
        while (index < $('tr').length) {
            const element = $('tr').eq(index);
          
            // Check for chords in the current element
            const chordElements = element.find('td.chords_en, td.chords'); // Get the chords in this row
          
            if (chordElements.length > 0) {
              // Extract the chord text, preserving spaces
              const chordText = chordElements.text().trimEnd().replace(/\n/g, ''); 
              currentChordLine = chordText;
            }
          
            // Check for lyrics in the next element (don't skip, but handle them separately)
            const lyricElement = element.find('td.song').text().trim(); 
          
            if (lyricElement) {
              currentLyricLine = lyricElement;
            }
          
            // Combine chords and lyrics into one object
            if (currentChordLine || currentLyricLine) {
              lines.push({
                chords: currentChordLine || '',
                lyrics: currentLyricLine || ''
              });
          
              // Clear the current line data
              currentChordLine = '';
              currentLyricLine = '';
            }
          
            // Increment index by 1 to check the next row, but don't skip alternating elements
            index += 1;
          }
    
        return lines;
      } catch (error) {
        console.error('Error fetching chords and lyrics:', error);
        return [];
      }
}


async function searchSong(query) {
    try {
        console.log('Searching for:', query);
        const searchUrl = `https://www.tab4u.com/resultsSimple?tab=songs&q=${encodeURIComponent(query)}`;
        const response = await axios.get(searchUrl);
        const $ = cheerio.load(response.data);
        const songs = [];

        $('div.recUpUnit').each((i, element) =>
        {
            const linkElement = $(element).find('a.ruSongLink');
            const songName = $(element).find('div.sNameI19').text().trim().replace(/\s\/$/, '');
            const artistName = $(element).find('div.aNameI19').text().trim();
            const songLink = `https://www.tab4u.com/${linkElement.attr('href')}`;
            
            songs.push({ songName, artistName, songLink });
        });

    return songs;
    }
    catch (error)
    {
        console.error('Error fetching search results:', error);
        return [];
    }
}