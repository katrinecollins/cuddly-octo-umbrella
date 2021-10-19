import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import {setContext} from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: '/graphql',
});

const auth = setContext((_, {headers}) => {
  const savedToken = localStorage.getItem("id_token");

  return{
    headers: {
      ...headers,
      authorization: savedToken ? `Bearer ${savedToken}` : ''
    }
  }
})

const client = new ApolloClient({
  link: auth.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path='/' component={SearchBooks} />
          <Route exact path='/saved' component={SavedBooks} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
