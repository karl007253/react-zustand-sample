import useDocumentTitle from "../../common/hooks/DocumentTitle";

import MainLayout from "../../common/layout/MainLayout";
import DashboardLayout from "../../common/layout/DashboardLayout";

import Summary from "./component/Summary";
import Storage from "./component/Storage";
import ReleasesAndBuild from "./component/ReleasesAndBuild";

const Dashboard = () => {
    useDocumentTitle("dashboard");

    return (
        <MainLayout>
            <DashboardLayout>
                <Summary />
                <ReleasesAndBuild />
                <Storage />
            </DashboardLayout>
        </MainLayout>
    );
};

export default Dashboard;
