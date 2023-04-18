import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';

import GospelAPI from './api';

dotenv.config({ path: `${process.env.NODE_PATH}/src/.env` });

const typeDefs = `#graphql
type Gospel {
    query: String!
    canonical: String!
    passages: [String!]!
}

type Query {
    gospel(by: GospelInput!): Gospel
}

input GospelInput {
    book: String!
    chapter: Int!
    verse: Int!
}
`;
const resolvers = {
    Query: {
        gospel: async (_, { by: { book, chapter, verse } }, { dataSources }) => {
            const { query, canonical, passages } = await dataSources.gospelApi.getSingleVerse(
                book, chapter, verse
            );
            return { query, canonical, passages };
        }
    }
};
const server = new ApolloServer({
    typeDefs,
    resolvers
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => ({
        dataSources: {
            gospelApi: new GospelAPI()
        }
    })
});
console.log('Server ready at: ', url);
