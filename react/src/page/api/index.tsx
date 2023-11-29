import useDocumentTitle from "../../common/hooks/DocumentTitle";
import MainLayout from "../../common/layout/MainLayout";
import ModuleLayout from "../../common/layout/ModuleLayout";
import ApiDashboard from "./component/ApiDashboard";

const Api = () => {
    useDocumentTitle("api");

    return (
        <MainLayout>
            <ModuleLayout module="API">
                <ApiDashboard />
            </ModuleLayout>
        </MainLayout>
    );
};

export default Api;
