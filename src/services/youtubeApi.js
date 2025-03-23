import axios from 'axios';

const API_KEY = 'AIzaSyCt8w2LCSAOiNbzWcnpsK3npVU4TGgvJ6I'; // Replace with actual key
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

export const searchVideos = async (query, maxResults = 10) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: 'snippet',

        
        q: encodeURIComponent(query),
        type: 'video',
        maxResults: maxResults,
        key: API_KEY
      }
    });

    
    // Ensure response contains expected data
    if (!response.data?.items) {
      throw new Error('Invalid API response');
    }
    
    return response.data.items;
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch videos');
  }
};
