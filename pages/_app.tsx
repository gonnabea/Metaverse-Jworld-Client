import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const cache = new InMemoryCache()

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: cache,
  
});

function MyApp({ Component, pageProps }: AppProps) {

  return <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>

}
export default MyApp
