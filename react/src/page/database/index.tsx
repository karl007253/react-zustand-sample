import MainLayout from "../../common/layout/MainLayout";
import useDocumentTitle from "../../common/hooks/DocumentTitle";
import DatabaseDashboard from "./component/DatabaseDashboard";
import ModuleLayout from "../../common/layout/ModuleLayout";

const Module = () => {
    useDocumentTitle("database");

    return (
        <MainLayout>
            <ModuleLayout module="DATABASE">
                <DatabaseDashboard />
            </ModuleLayout>
        </MainLayout>
    );
};

export default Module;
