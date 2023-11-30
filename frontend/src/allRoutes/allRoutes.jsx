import React from "react";
import { Route, Routes } from "react-router-dom";
import Loginpage from "../pages/Loginpage";
import Chatpage from "../pages/Chatpage";
import SignupPage from "../pages/Signuppage";
import Homepage from "../pages/Homepage";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      {/* <Route path="/login" element={<Loginpage />} /> */}
      <Route path="/login" element={<Homepage />} />
      <Route path="/" element={<Chatpage />} />
    </Routes>
  );
};

export default AllRoutes;
