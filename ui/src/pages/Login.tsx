import React from "react";
import { FC } from "react";
import "../index.css";
import NavBar from "../components/NavBar";
import { authGoogle } from "../api/auth";

export const LoginPage: FC = () => {
  const handleGoogleLogin = () => {
    console.log(
      "handleGoogleLogin process.env.HTTP_SERVER_URL",
      process.env.HTTP_SERVER_URL
    );
    authGoogle();
  };

  return (
    <>
      <NavBar showSearch={false} />
      <div className="min-h-screen bg-background-primary flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              Welcome to Streamer
            </h1>
            <p className="text-text-secondary">
              Watch and stream videos together with friends
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 bg-background-card hover:bg-background-secondary text-text-primary px-6 py-4 rounded-card shadow-card transition-all duration-200 hover:shadow-lg group"
            >
              <img src="/png/google.png" alt="Google" className="w-6 h-6" />
              <span className="font-medium text-lg group-hover:scale-105 transition-transform duration-200">
                Continue with Google
              </span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-text-tertiary text-sm">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
