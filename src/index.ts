import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { Resolvers } from './generated/graphql';

import dotenv from 'dotenv';

import GospelAPI from './api';

if (!process.env.NODE_PATH) {
  throw new Error('Env var NODE_PATH not configured');
}
dotenv.config({ path: `${process.env.NODE_PATH}/src/.env` });

export interface Context {
  dataSources: {
    gospelAPI: GospelAPI;
  };
}

const typeDefs = readFileSync('src/schema.graphql', { encoding: 'utf-8' });

const resolvers: Resolvers = {
  Query: {
    gospel: async (_, { by: { book, chapter, verse } }, { dataSources }) => {
      const { gospelAPI: api } = dataSources;
      const { query, canonical, passages } = await api.getSingleVerse(book, chapter, verse);
      return { query, canonical, passages };
    }
  }
};

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async (/* { req, res } */) => {
    const { cache } = server;
    return {
      dataSources: {
        gospelAPI: new GospelAPI({ cache })
      }
    };
  }
});
console.log('Server ready at: ', url);
