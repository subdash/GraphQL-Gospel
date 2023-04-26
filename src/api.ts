import { AugmentedRequest, RESTDataSource } from '@apollo/datasource-rest';
import { Gospel, GospelResponse, PassageResponse, WordCount, WordMapResponse } from './generated/graphql';

const BASE_URL = 'https://api.esv.org';

class GospelAPI extends RESTDataSource {
  override baseURL = BASE_URL;

  async getVerse(book: Gospel, chapter: number, verse: number): Promise<PassageResponse> {
    const { canonical, passages } = await this.getPassage(book, chapter, verse);

    return {
      canonical,
      passages
    };
  }

  async getVerseWordMap(book: Gospel, chapter: number, verse: number): Promise<WordMapResponse> {
    const { passages } = await this.getPassage(book, chapter, verse);
    const words = mapWords(passages.join(''));

    return { words };
  }

  private async getPassage(book: Gospel, chapter: number, verse: number): Promise<GospelResponse> {
    const endpoint = '/v3/passage/text/';
    const { query, canonical, passages } = await this.get<GospelResponse>(endpoint, {
      params: { q: `${book}+${chapter}:${verse}` }
    });

    return {
      query,
      canonical,
      passages
    };
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    const { API_TOKEN: apiToken } = process.env;
    if (!apiToken) {
      throw new Error('ESV API token undefined in environment');
    }

    request.headers.authorization = apiToken;
  }
}

const mapWords = (text: string): WordCount[] => {
  const punctuationRegex = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g;
  const newlineRegex = /\r?\n|\r/g;
  const sanitized = text.replace(punctuationRegex, '').replace(newlineRegex, '');
  const map = new Map<string, number>();

  const words = sanitized.split(' ').map((word) => word.toUpperCase());
  words.forEach((word) => {
    const count = map.get(word);
    if (count) {
      map.set(word, count + 1);
    } else {
      map.set(word, 1);
    }
  });

  const arrayOfEntries = Object.entries(Object.fromEntries(map));

  return arrayOfEntries.map(([word, count]) => ({
    word,
    count
  }));
}

export default GospelAPI;
