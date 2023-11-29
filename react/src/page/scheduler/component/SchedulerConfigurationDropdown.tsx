import { Dropdown, Form, FormSelectProps } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useState, forwardRef } from "react";

import useStore from "../../../common/zustand/Store";
import { ConfigurationType } from "../../../common/zustand/interface/ConfigurationInterface";

import useActiveConfiguration from "../../../common/hooks/ActiveConfiguration";

import EditConfiguration from "./modals/EditConfiguration";

type SchedulerConfigurationDropdownToggleProps = {
    selectedValue?: string;
};

// Apply select input as the custom dropdown toggle for Scheduler Configuration Dropdown
const SchedulerConfigurationDropdownToggle = forwardRef<
    HTMLSelectElement,
    FormSelectProps & SchedulerConfigurationDropdownToggleProps
>((props, ref) => {
    const { t } = useTranslation();

    const configuration = useStore((state) =>
        state.configuration.filter(
            (c) => c.type === ConfigurationType.SCHEDULER
        )
    );

    return (
        <Form.Select
            className="text-rg px-12 py-6 text-dark-gray rounded-6 border-platinum"
            ref={ref}
            aria-label="config-dropdown"
            onClick={(e) => {
                e.preventDefault();
                props.onClick?.(e);
            }}
            value={props.selectedValue || ""}
            onChange={() => undefined}
        >
            {/* Placeholder for the dropdown */}
            <option hidden>
                {t("scheduler.dashboard.header.dropdown.select")}
            </option>

            {configuration.map(({ name, uuid }) => (
                <option hidden value={uuid} key={uuid}>
                    {name}
                </option>
            ))}
        </Form.Select>
    );
});

const SchedulerConfigurationDropdown = () => {
    const { t } = useTranslation();

    const [showEditModal, setShowEditModal] = useState(false);

    const { configuration, setSelectedConfiguration } = useStore((state) => ({
        // Get the list of SCHEDULER configuration only
        configuration: state.configuration.filter(
            (c) => c.type === ConfigurationType.SCHEDULER
        ),
        setSelectedConfiguration: state.setSelectedSchedulerConfiguration,
    }));

    const activeConfiguration = useActiveConfiguration(
        ConfigurationType.SCHEDULER
    );

    return (
        <>
            <Dropdown className="w-100">
                <Dropdown.Toggle
                    as={SchedulerConfigurationDropdownToggle}
                    selectedValue={activeConfiguration?.uuid}
                />

                <Dropdown.Menu className="text-rg w-100">
                    <Dropdown.Item onClick={() => setShowEditModal(true)}>
                        {/* moving dropdown locale to header */}
                        {t("scheduler.dashboard.header.dropdown.edit")}
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => setSelectedConfiguration()}>
                        {t("scheduler.dashboard.header.dropdown.clear")}
                    </Dropdown.Item>

                    {/* Ensure divider line is not shown when there's no configuration */}
                    {configuration.length > 0 && (
                        <Dropdown.Divider className="m-3 bg-light-gray" />
                    )}

                    {configuration.map(({ uuid, name }) => (
                        <Dropdown.Item
                            key={uuid}
                            onClick={() => setSelectedConfiguration(uuid)}
                            className="text-truncate"
                        >
                            {name}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>

            {/* Edit Configuration Modal */}
            <EditConfiguration
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
            />
        </>
    );
};

export default SchedulerConfigurationDropdown;
