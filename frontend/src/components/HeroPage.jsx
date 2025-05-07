import React from "react";

import Layout from "./common/Layout";
import AboutUs from "./common/AboutUs";
import Contact from "./common/Contact";

import Hero from "./common/Hero";

const HeroPage = () => {
  return (
    <div className="bg-gray-900">
      <Layout>
        <div className="p-0 m-0">
          <Hero />
        </div>
       
      </Layout>
    </div>
  );
};

export default HeroPage;