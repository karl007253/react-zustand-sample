import MainLayout from "../../common/layout/MainLayout";
import useDocumentTitle from "../../common/hooks/DocumentTitle";
import SchedulerDashboard from "./component/SchedulerDashboard";
import ModuleLayout from "../../common/layout/ModuleLayout";

const Scheduler = () => {
    useDocumentTitle("scheduler");

    return (
        <MainLayout>
            <ModuleLayout module="SCHEDULER">
                <SchedulerDashboard />
            </ModuleLayout>
        </MainLayout>
    );
};

export default Scheduler;
