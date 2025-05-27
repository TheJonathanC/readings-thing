import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Interface for reading data
interface Reading {
  type: string;
  notation: string;
}

// GET handler for the API route
export async function GET() {
  try {
    // Fetch HTML from USCCB daily readings
    const response = await axios.get('https://bible.usccb.org/daily-bible-reading', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    // Load HTML into cheerio
    const $ = cheerio.load(response.data);
    const readings: Reading[] = [];

    // Select all reading containers
    $('div.content-header').each((_, element) => {
      const readingType = $(element).find('h3.name').text().trim();
      const notation = $(element).find('div.address a').text().trim();

      if (readingType && notation) {
        readings.push({
          type: readingType,
          notation: notation,
        });
      }
    });

    // Return JSON response
    return NextResponse.json({ readings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching readings:', error);
    return NextResponse.json({ error: 'Failed to fetch readings' }, { status: 500 });
  }
}