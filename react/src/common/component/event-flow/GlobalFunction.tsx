import { useState, useEffect } from "react";
import { Container, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import { cloneDeep } from "lodash";

import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

import useToast from "../../hooks/Toast";
import GlobalDelete from "./modals/GlobalDelete";
import GlobalAdd from "./modals/GlobalAdd";

import GlobalTree, { GlobalTreeDataNode } from "./GlobalTree";

// TODO: Don't import anything outside event-flow folder
//       EventFlowPanel component is the one using eventflow, not the eventflow using EventFlowPanel
import { getActionFormatVariableByParameter } from "../helper/Function";

// TODO: Create own generate unique id in event flow
import generateUniqueId from "../../helper/UniqueId";
import { ACTION_PREFIX } from "../../data/Constant";

import {
    CombinedGlobalActionFormat,
    GlobalActionParameter,
    GlobalActionFormat,
    GlobalForm,
} from "./data/Functions";

type GlobalFunctionModuleProps = {
    globalFunctions: CombinedGlobalActionFormat[];
    onUpdateGlobal: (newGlobalFunctions: CombinedGlobalActionFormat[]) => void;
    selectedGlobalFunction: GlobalActionFormat | null;
    setSelectedGlobalFunction: (
        selectedGlobalFunction: GlobalActionFormat | null
    ) => void;
};

const getGlobalFunctionsTreeData = (
    globalFunctions: CombinedGlobalActionFormat[]
) => {
    return globalFunctions.map((globalFunction: CombinedGlobalActionFormat) => {
        const functionName = getActionFormatVariableByParameter(
            globalFunction,
            "function"
        ) as string;

        const functionParams = getActionFormatVariableByParameter(
            globalFunction,
            "parameter"
        ) as GlobalActionParameter;

        return {
            key: globalFunction.uuid,
            title: functionName,
            parameter: functionParams,
            process: globalFunction.process,
            result: globalFunction.result,
        };
    });
};

/**
 * Displays the properties of a function
 */
const GlobalFunction = ({
    globalFunctions,
    onUpdateGlobal,
    selectedGlobalFunction,
    setSelectedGlobalFunction,
}: GlobalFunctionModuleProps) => {
    const { t } = useTranslation();

    const toastMessage = useToast(true);
    const [showTree, setShowTree] = useState(true);
    const [search, setSearch] = useState("");
    const [deleteModalVisible, setDeleteVisibility] = useState<boolean>(false);
    const showDeleteModal = () => setDeleteVisibility(true);
    const hideDeleteModal = () => setDeleteVisibility(false);

    const [globalAddVisible, setGlobalAddVisible] = useState<boolean>(false);
    const showGlobalAdd = () => setGlobalAddVisible(true);
    const hideGlobalAdd = () => setGlobalAddVisible(false);

    const treeData = getGlobalFunctionsTreeData(globalFunctions);

    const functionName =
        selectedGlobalFunction &&
        (getActionFormatVariableByParameter(
            selectedGlobalFunction,
            "function"
        ) as string);

    useEffect(() => {
        if (showTree === false) {
            setTimeout(() => {
                setShowTree(true);
            }, 100);
        }
    }, [showTree]);

    const handleUpdateGlobal = (data: GlobalForm, type?: string) => {
        const { name, result, uuid } = data;

        let selectedGlobalFunctions = cloneDeep(globalFunctions);
        if (type === "delete") {
            selectedGlobalFunctions = selectedGlobalFunctions.filter(
                (currentSelectedGlobalFunction) => {
                    return currentSelectedGlobalFunction.uuid !== uuid;
                }
            );

            // reset selectedGlobalFunction
            setSelectedGlobalFunction(null);
        } else {
            selectedGlobalFunctions = [
                ...selectedGlobalFunctions,
                {
                    function: name,
                    parameter: {},
                    process: [],
                    result,
                    uuid: generateUniqueId(ACTION_PREFIX),
                } as GlobalActionFormat,
            ];
        }

        onUpdateGlobal(selectedGlobalFunctions);
    };

    // Triggers the search on component tree
    const handleComponentSearch = (event: any) => {
        // Trigger the search when enter is pressed
        if (event.which === 13) {
            setSearch(event.target.value);
        }
    };

    // Triggers when mouse lost focus on the component search textbox
    const handleOnBlur = (event: any) => {
        setSearch(event.target.value);
    };

    const handleSelect = ({
        key,
        title,
        parameter,
        process,
        result,
    }: GlobalTreeDataNode) => {
        setSelectedGlobalFunction({
            uuid: key,
            function: title,
            parameter,
            process,
            result,
        });
    };

    /**
     * {function for deleting a global function}
     * @return  {void}
     */
    const deleteGlobalFunction = () => {
        if (selectedGlobalFunction) {
            handleUpdateGlobal(
                {
                    uuid: selectedGlobalFunction.uuid,
                },
                "delete"
            );

            setShowTree(false);
            toastMessage(
                t("eventFlow.tabs.global.delete.form.success.function", {
                    name: functionName,
                }),
                toast.TYPE.SUCCESS
            );
        } else {
            toastMessage(
                t("eventFlow.tabs.global.delete.form.error.select.function"),
                toast.TYPE.ERROR
            );
        }

        hideDeleteModal();
    };

    const handleGlobalAddConfirm = (data: GlobalForm) => {
        // Find the name from the global function
        const func = globalFunctions.find((item) => {
            const name = getActionFormatVariableByParameter(
                item,
                "function"
            ) as string;

            return name === data.name;
        });

        // The function does exists
        if (func) {
            toastMessage(
                t("eventFlow.tabs.global.add.form.error.existing.name"),
                toast.TYPE.ERROR
            );
        } else {
            handleUpdateGlobal(data);

            hideGlobalAdd();
        }
    };

    return (
        <Container className="h-180 position-relative p-0 mt-3">
            <div className="param-nav bg-light-gray">
                <ul className="nav nav-tabs px-2">
                    <li className="nav-item">
                        <button
                            type="button"
                            draggable="false"
                            className="border-0 text-sm px-1 py-2 text-philippine-gray"
                            role="tab"
                        >
                            Global Functions
                        </button>
                    </li>
                    <li className="nav-item ms-auto d-flex align-items-center">
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip>{t("common.button.add")}</Tooltip>
                            }
                        >
                            <button
                                type="button"
                                aria-label={t("common.button.add")}
                                draggable="false"
                                className="float-end border-0 bg-transparent"
                                onClick={(e) => {
                                    e.preventDefault();
                                    showGlobalAdd();
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="small text-granite-gray"
                                />
                            </button>
                        </OverlayTrigger>
                        <GlobalAdd
                            show={globalAddVisible}
                            handleClose={hideGlobalAdd}
                            handleConfirm={handleGlobalAddConfirm}
                        />
                    </li>
                    {treeData.length > 0 && (
                        <li className="nav-item d-flex align-items-center">
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip>
                                        {t("common.button.delete")}
                                    </Tooltip>
                                }
                            >
                                <button
                                    type="button"
                                    aria-label={t("common.button.delete")}
                                    draggable="false"
                                    className="float-end border-0 bg-transparent"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        showDeleteModal();
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        className="small text-granite-gray"
                                    />
                                </button>
                            </OverlayTrigger>
                            <GlobalDelete
                                show={deleteModalVisible}
                                handleClose={hideDeleteModal}
                                onConfirm={deleteGlobalFunction}
                                name={
                                    selectedGlobalFunction
                                        ? `${functionName}?`
                                        : "this item?"
                                }
                            />
                        </li>
                    )}
                </ul>
            </div>
            <div className="row param h-80">
                <div className="col-sm-12">
                    {treeData.length > 0 ? (
                        <>
                            <div className="px-2 py-2">
                                <input
                                    id="global-function-search"
                                    type="text"
                                    className="form-control h-30 text-rg text-italic"
                                    placeholder={t("common.text.search")}
                                    onKeyUp={handleComponentSearch}
                                    onBlur={handleOnBlur}
                                />
                            </div>

                            <GlobalTree
                                className="overflow-auto h-105 pt-2"
                                treeData={treeData}
                                filterText={search}
                                onSelect={handleSelect}
                                clearSelected={selectedGlobalFunction === null}
                            />
                        </>
                    ) : (
                        <div className="text-argent text-sm m-2 mt-3 d-flex justify-content-center align-items-center">
                            {t("eventFlow.tabs.global.noGlobalFunctions")}
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default GlobalFunction;
