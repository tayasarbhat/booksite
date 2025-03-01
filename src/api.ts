import axios from 'axios';
import { ApiResponse } from './types';

// Replace this URL with your deployed Google Apps Script web app URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSpyFRo8N2dCJ3gGbJttnOhu8hjltqAyXm3MlmDIxBVzSjY42yX-PKYeFa3dGVDxMV/exec';

// Create a cached version of the API response
let cachedBooks: any[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchBooks() {
  try {
    // Check if we have a valid cache
    if (cachedBooks && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      return cachedBooks;
    }
    
    // If no valid cache, make the API request
    const response = await axios.get<ApiResponse>(APPS_SCRIPT_URL);
    
    if (response.data.success) {
      // Update cache
      cachedBooks = response.data.data;
      cacheTimestamp = Date.now();
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Failed to fetch books');
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    
    // If we have a stale cache, return it rather than failing completely
    if (cachedBooks) {
      console.log('Returning stale cache due to fetch error');
      return cachedBooks;
    }
    
    throw error;
  }
}