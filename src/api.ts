import { AugmentedRequest, RESTDataSource } from '@apollo/datasource-rest';
import { Gospel, GospelResponse } from './generated/graphql';

const BASE_URL = 'https://api.esv.org';

class GospelAPI extends RESTDataSource {
    override baseURL = BASE_URL;

    async getSingleVerse(book: Gospel,
                         chapter: number,
                         verse: number
    ): Promise<GospelResponse> {
        const passageEndpoint = '/v3/passage/text/';
        const { query, canonical, passages } = await this.get<GospelResponse>(passageEndpoint, {
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
