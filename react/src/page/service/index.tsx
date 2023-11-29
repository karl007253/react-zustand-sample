import useDocumentTitle from "../../common/hooks/DocumentTitle";

import MainLayout from "../../common/layout/MainLayout";
import ServiceLayout from "../../common/layout/ServiceLayout";
import ServiceLeftPanel from "./component/ServiceLeftPanel";
import ServiceRightPanel from "./component/ServiceRightPanel";

const Service = () => {
    useDocumentTitle("service");

    return (
        <MainLayout>
            <ServiceLayout>
                <ServiceLeftPanel />
                <ServiceRightPanel />
            </ServiceLayout>
        </MainLayout>
    );
};

export default Service;
