import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/react-hooks";
import { persistCache } from 'apollo-cache-persist';

const cache = new InMemoryCache()

// const typeDefs = gql`

//   input XYZType {
//     x: Number!
//     y: Number!
//     z: Number!
//   }

//   input threeModelInput {
//     name: String
//     position: XYZType
//     scale: XYZType
//     rotateX: Number
//     installed: Boolean
//     price: Number
//     videoUrl: String
//     imageUrl: String
//     textContents: String
//   }

//   input SaveThreeModelInput {
//     models: [threeModelInput]
//   }
// `;


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: cache
});

function MyApp({ Component, pageProps }: AppProps) {

  return <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>

}
export default MyApp
