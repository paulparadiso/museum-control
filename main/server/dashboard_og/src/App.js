import React from 'react';
import './App.css';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_USER } from './GraphqlQueries';
import Routes from './Routes';

function App() {

  const { loading, err, data } = useQuery(GET_CURRENT_USER);

  if(loading) return <></>

  return (
    <Routes/>
  )
}

export default App;
