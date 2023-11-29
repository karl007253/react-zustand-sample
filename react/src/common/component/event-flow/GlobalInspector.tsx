import { useState, useEffect } from "react";
import produce from "immer";

import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
    CombinedGlobalActionFormat,
    GlobalActionFormat,
    GlobalActionParameter,
} from "./data/Functions";
import { valueTypes } from "./data/Constant";

import Input from "./form/Input";
import Select from "./form/Select";

// TODO: Create own debounce and uniqueId generator?
import generateUniqueId from "../../helper/UniqueId";
import useDebounce from "../../hooks/Debounce";
import useToast from "../../hooks/Toast";

import { getActionFormatVariableByParameter } from "../helper/Function";

type GlobalForm = {
    name?: string;
    result?: string;
};

type GlobalParameter = {
    uuid: string;
    name: string;
    type: string;
};

type GlobalInspectorForm = {
    form: GlobalForm;
    parameter: GlobalParameter[];
};

type GlobalInspectorProps = {
    globalFunctionList: CombinedGlobalActionFormat[];
    globalFunction: GlobalActionFormat;

    // TODO: for now this is here to update the selected global function
    setSelectedGlobalFunction: (
        selectedGlobalFunction: GlobalActionFormat | null
    ) => void;

    onUpdate: (global: GlobalActionFormat) => void;
};

const GlobalInspector = ({
    globalFunctionList,
    globalFunction,
    setSelectedGlobalFunction,
    onUpdate,
}: GlobalInspectorProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);

    const [globalInspectorForm, setGlobalInspectorForm] =
        useState<GlobalInspectorForm>({
            form: {},
            parameter: [],
        });

    const debouncedGlobalInspectorForm =
        useDebounce<GlobalInspectorForm>(globalInspectorForm);

    const convertParametersToList = (): GlobalParameter[] => {
        return Object.keys(globalFunction.parameter).map((param) => ({
            uuid: generateUniqueId(),
            name: param,
            type: globalFunction.parameter[param],
        }));
    };

    const updateGlobalFunction = (newData: Partial<GlobalActionFormat>) => {
        const newGlobalFunction = {
            ...globalFunction,
            ...newData,
        };

        // Set the selected
        setSelectedGlobalFunction(newGlobalFunction);

        onUpdate(newGlobalFunction);
    };

    // Overwrite if global function changes
    useEffect(() => {
        setGlobalInspectorForm({
            form: {
                name: globalFunction.function,
                result: globalFunction.result,
            },
            parameter: convertParametersToList(),
        });
    }, [globalFunction.function]);

    useEffect(() => {
        // Validate if have the same name
        const func = globalFunctionList.find((item) => {
            const name = getActionFormatVariableByParameter(
                item,
                "function"
            ) as string;

            // Check the uuid so that it won't check itself
            return (
                item.uuid !== globalFunction.uuid &&
                name === debouncedGlobalInspectorForm.form.name
            );
        });

        // The function does exists
        if (func) {
            toastMessage(
                t("eventFlow.tabs.global.add.form.error.existing.name"),
                toast.TYPE.ERROR
            );
        } else {
            // New function global parameters
            const parameter: GlobalActionParameter = {};

            debouncedGlobalInspectorForm.parameter.forEach((item) => {
                if (item.name !== "") {
                    parameter[item.name] = item.type;
                }
            });

            updateGlobalFunction({
                function:
                    debouncedGlobalInspectorForm.form.name ??
                    globalFunction.function,
                result:
                    debouncedGlobalInspectorForm.form.result ??
                    globalFunction.result,
                parameter,
            });
        }
    }, [debouncedGlobalInspectorForm]);

    const handleParameterChange = (data: GlobalParameter) => {
        setGlobalInspectorForm({
            ...globalInspectorForm,
            parameter: produce(globalInspectorForm.parameter, (draft) => {
                const index = draft.findIndex(
                    (item) => item.uuid === data.uuid
                );

                if (index !== -1) {
                    const { name, type } = data;
                    const param = draft[index];

                    draft[index] = {
                        ...param,
                        name,
                        type,
                    };
                }
            }),
        });
    };

    // Handles adding a parameter
    const handleAdd = () => {
        setGlobalInspectorForm({
            ...globalInspectorForm,
            parameter: [
                ...globalInspectorForm.parameter,
                {
                    uuid: generateUniqueId(),
                    name: "",
                    type: "string",
                },
            ],
        });
    };

    // Handles deleting a parameter
    const handleDelete = (uuid: string) => {
        // Get all parameters except for the one to be deleted
        const newParameters = globalInspectorForm.parameter?.filter(
            (item) => item.uuid !== uuid
        );

        setGlobalInspectorForm({
            ...globalInspectorForm,
            parameter: newParameters,
        });

        // New function global parameters
        const parameter: GlobalActionParameter = {};

        newParameters.forEach((item) => {
            if (item.name !== "") {
                parameter[item.name] = item.type;
            }
        });

        updateGlobalFunction({ parameter });
    };

    return (
        <Container className="inspector-parameter position-relative p-0 mt-2 h-180 global-inspector-parameter">
            <div className="bg-light-gray">
                <ul className="nav nav-tabs px-2">
                    <li className="nav-item">
                        <div className="bg-light-gray text-philippine-gray text-sm ps-2 pt-2 pb-2">
                            {t("eventFlow.inspector.header.title", {
                                name: globalFunction.function,
                            })}
                        </div>
                    </li>
                </ul>
            </div>

            <div className="row ms-auto me-auto overflow-auto mt-2 h-75">
                <div className="col-sm-12">
                    <div className="row mb-1 d-flex align-items-center pe-1">
                        <span className="col-sm-4 col-form-label param-label text-philippine-gray text-sm">
                            {t("eventFlow.inspector.form.label.name")}
                        </span>
                        <div className="col-sm-8">
                            <div className="input-group input-group-sm">
                                <Input
                                    specialCharactersValidation
                                    type="text"
                                    className="form-control"
                                    ariaLabel="global-name"
                                    value={globalFunction.function}
                                    onChange={(val) =>
                                        setGlobalInspectorForm({
                                            ...globalInspectorForm,
                                            form: {
                                                name: val,
                                            },
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-1 d-flex align-items-center pe-1">
                        <span className="col-sm-4 col-form-label param-label text-philippine-gray text-sm">
                            {t("eventFlow.inspector.form.label.result")}
                        </span>
                        <div className="col-sm-8">
                            <div className="input-group input-group-sm">
                                <Input
                                    specialCharactersValidation
                                    type="text"
                                    className="form-control"
                                    ariaLabel="global-result"
                                    value={globalFunction.result ?? ""}
                                    onChange={(val) =>
                                        setGlobalInspectorForm({
                                            ...globalInspectorForm,
                                            form: {
                                                result: val,
                                            },
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 mb-2 bg-light-gray text-sm text-philippine-gray border-bottom border-color-chinese-silver ps-2 pt-1 pb-1">
                        {t("eventFlow.inspector.header.parameters")}
                    </div>

                    {globalInspectorForm.parameter.map((param) => (
                        <div
                            className="mb-1 global-parameters"
                            key={param.uuid}
                        >
                            <Stack
                                className="mt-1 ps-2"
                                direction="horizontal"
                                gap={2}
                            >
                                <Input
                                    specialCharactersValidation
                                    type="text"
                                    className="form-control form-control-sm w-120"
                                    value={param.name}
                                    onChange={(val) =>
                                        handleParameterChange({
                                            uuid: param.uuid,
                                            name: val,
                                            type: param.type,
                                        })
                                    }
                                />
                                <Select
                                    className="form-select form-select-sm"
                                    value={param.type}
                                    onChange={(val) =>
                                        handleParameterChange({
                                            uuid: param.uuid,
                                            name: param.name,
                                            type: val,
                                        })
                                    }
                                >
                                    {valueTypes.map((item) => (
                                        <option key={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </Select>
                                <button
                                    type="button"
                                    draggable="false"
                                    className="border-0 text-sm px-1 py-2 bg-transparent"
                                    onClick={() => handleDelete(param.uuid)}
                                >
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className="text-philippine-gray"
                                    />
                                </button>
                            </Stack>
                        </div>
                    ))}

                    <button
                        type="button"
                        draggable="false"
                        className="border-0 text-sm px-1 py-2 bg-transparent"
                        onClick={handleAdd}
                    >
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="text-philippine-gray"
                        />
                        <span className="ms-2 text-philippine-gray">
                            {t("eventFlow.inspector.button.addGlobal")}
                        </span>
                    </button>
                </div>
            </div>
        </Container>
    );
};

export default GlobalInspector;
