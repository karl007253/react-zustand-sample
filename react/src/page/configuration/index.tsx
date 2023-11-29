import useDocumentTitle from "../../common/hooks/DocumentTitle";

import MainLayout from "../../common/layout/MainLayout";
import ConfigurationLayout from "../../common/layout/ConfigurationLayout";
import ConfigurationTab from "./component/ConfigurationTab";
import { ConfigurationInputType } from "./component/ConfigurationInput";
import { GlobalConfigurationData } from "../../common/zustand/interface/ConfigurationInterface";

type KeysOfUnion<T> = T extends T ? keyof T : never;

type ConfigurationFieldItem = {
    fieldName: KeysOfUnion<GlobalConfigurationData>;
    defaultValue?: string | number | boolean;
    type?: ConfigurationInputType;
    disabled?: boolean;
};

type ConfigurationFields = { [key: string]: string };

const Configuration = () => {
    useDocumentTitle("configuration");

    return (
        <MainLayout>
            <ConfigurationLayout>
                <ConfigurationTab />
            </ConfigurationLayout>
        </MainLayout>
    );
};

export type { ConfigurationFieldItem, ConfigurationFields };
export default Configuration;
