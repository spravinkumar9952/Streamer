import "./App.css";
import React from "react";
import PageRoute from "./PageRoute";
import { AuthProvider } from "./contexts/Auth";

// declare const Buffer;

function App() {
    return (
        <div className="App">
            <AuthProvider>
                <PageRoute />
            </AuthProvider>
        </div>
    );
}

export default App;
