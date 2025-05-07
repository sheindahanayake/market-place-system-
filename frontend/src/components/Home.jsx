import React from "react";

import Layout from "./common/Layout";
import AboutUs from "./common/AboutUs";
import Contact from "./common/Contact";

import Login from "./common/Login";

const HomePage = () => {
  return (
    <div className="bg-gray-900">
      <Layout>
        <div className="p-0 m-0">
          <Login />
        </div>
       
      </Layout>
    </div>
  );
};

export default HomePage;