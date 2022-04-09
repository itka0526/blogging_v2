import React, {useState} from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AdminDashboard from "./admin components/AdminDashboard";

import reportWebVitals from "./reportWebVitals";

import { BrowserRouter, Routes, Route } from "react-router-dom";
function Main ( ) {
    const [state, setState] = useState(false);
    return    <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<App />}></Route>
                    <Route exact path="/admin" element={<AdminDashboard />} />
                    <Route path="*" element={<AdminDashboard />}></Route>
                </Routes>
            </BrowserRouter>
}
ReactDOM.render(
    <React.StrictMode>
        <Main/>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
