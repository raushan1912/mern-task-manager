import React from "react";
import UI_IMG from "../../assets/images/bg-img.jpg";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="w-full md:w-[60vw] px-12 pt-8 pb-12 flex flex-col">
        <h2 className="text-lg font-medium text-black mb-6">Task Manager</h2>

        {children}
      </div>

      {/* Right Side Image */}
      <div className="hidden md:flex w-[40vw] items-center justify-center bg-sky-100 p-8">
        <img
          src={UI_IMG}
          alt="Auth"
          className="w-64 lg:w-[90%] object-contain"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
