import React from 'react';
import Hero from './Hero';
import FeaturedProjects from './FeaturedProjects';

const Home = ({ setActiveTab }) => {
  return (
    <>
      <Hero />
      <FeaturedProjects setActiveTab={setActiveTab} />
    </>
  );
};

export default Home;
