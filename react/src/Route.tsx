import { Navigate, Route, Routes } from "react-router-dom";

import MainRoute from "./common/route/MainRoute";

import Auth from "./page/auth";

import Dashboard from "./page/dashboard";
import NotFound from "./page/not-found";
import Scheduler from "./page/scheduler";
import Database from "./page/database";
import Api from "./page/api";
import Configuration from "./page/configuration";
import Service from "./page/service";
import ProtectedRoute from "./common/route/ProtectedRoute";

export default () => {
    return (
        <Routes>
            {/* Auth Route for storing token to cookie */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected Pages */}
            <Route element={<ProtectedRoute />}>
                {/* Main Route */}
                <Route element={<MainRoute />}>
                    <Route path="/dashboard/:appid" element={<Dashboard />} />
                    <Route path="/service/:appid" element={<Service />} />
                    <Route
                        path="/configuration/:appid"
                        element={<Configuration />}
                    />

                    {/* Module Route */}
                    <Route path="/module/:appid">
                        {/* Set /module/:appid/api as the default page of module */}
                        <Route index element={<Navigate to="api" replace />} />
                        <Route path="api" element={<Api />} />
                        <Route path="database" element={<Database />} />
                        <Route path="scheduler" element={<Scheduler />} />
                    </Route>
                </Route>
            </Route>

            {/* Route not found */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
