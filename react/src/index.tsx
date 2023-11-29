import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./common/localization/i18n";
import "./common/assets/sass/main.scss";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    process.env.REACT_APP_DISABLE_STRICT_MODE === "true" ? (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    ) : (
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
    )
);
