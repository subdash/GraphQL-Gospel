import { AugmentedRequest, RESTDataSource } from '@apollo/datasource-rest';

const BASE_URL = 'https://api.esv.org';


type Gospel =
| 'Matthew'
| 'Mark'
| 'Luke'
| 'John'
;

interface BibleApiResponse {
    query: string;
    canonical: string;
    passages: string[];
}

class GospelAPI extends RESTDataSource {
    override baseURL = BASE_URL;

    async getSingleVerse(book: Gospel,
                         chapter: number,
                         verse: number
    ): Promise<BibleApiResponse> {
        const passageEndpoint = '/v3/passage/text/';
        const { query, canonical, passages } = await this.get<BibleApiResponse>(passageEndpoint, {
            params: { q: `${book}+${chapter}:${verse}` }
        });
        return {
            query,
            canonical,
            passages
        };
    }

    override willSendRequest(_path: string, request: AugmentedRequest) {
        request.headers['authorization'] = process.env.API_TOKEN;
    }
}

export default GospelAPI;
