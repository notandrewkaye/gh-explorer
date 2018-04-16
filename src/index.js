import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import {ApolloClient} from "apollo-client";
import {ApolloProvider} from "react-apollo";
import {setContext} from "apollo-link-context";
import {InMemoryCache} from "apollo-cache-inmemory";
import {HttpLink} from "apollo-link-http";
import gql from "graphql-tag";

const TOKEN = process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN;

const authLink = setContext((_, {headers}) => {
  return {
    headers: {
      ...headers,
      authorization: TOKEN ? `Bearer ${TOKEN}` : null,
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(new HttpLink({uri: "https://api.github.com/graphql"})),
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      {
        organization(login: "zeit") {
          name
          repositories(last: 10) {
            edges {
              node {
                id
                descriptionHTML
                name
              }
            }
          }
        }
      }
    `,
  })
  .then(result => console.log(result));

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
registerServiceWorker();
