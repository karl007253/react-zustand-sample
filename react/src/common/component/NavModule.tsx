import { Stack } from "react-bootstrap";
import { useParams } from "react-router-dom";

import iconApiActive from "../assets/images/icons/api-active.svg";
import iconApi from "../assets/images/icons/api.svg";
import iconDatabaseActive from "../assets/images/icons/database-active.svg";
import iconDatabase from "../assets/images/icons/database.svg";
import iconSchedulerActive from "../assets/images/icons/scheduler-active.svg";
import iconScheduler from "../assets/images/icons/scheduler.svg";

import { ModuleType } from "../data/Type";
import NavModuleButton from "./NavModuleButton";
import ProjectIcon from "./ProjectIcon";

type NavModuleProps = {
    module: ModuleType;
};

const NavModule = ({ module }: NavModuleProps) => {
    const { appid } = useParams();

    return (
        <div className="module-nav-col">
            <ProjectIcon />

            <Stack direction="vertical" className="module-container gx-0">
                <NavModuleButton
                    name="api"
                    image={iconApi}
                    imageActive={iconApiActive}
                    imageTitle="module.icon.api.alt"
                    selected={module === "API"}
                    url={`/module/${appid}/api`}
                />

                <NavModuleButton
                    name="database"
                    image={iconDatabase}
                    imageActive={iconDatabaseActive}
                    imageTitle="module.icon.database.alt"
                    selected={module === "DATABASE"}
                    url={`/module/${appid}/database`}
                />

                <NavModuleButton
                    name="scheduler"
                    image={iconScheduler}
                    imageActive={iconSchedulerActive}
                    imageTitle="module.icon.scheduler.alt"
                    selected={module === "SCHEDULER"}
                    url={`/module/${appid}/scheduler`}
                />
            </Stack>
        </div>
    );
};

export default NavModule;
