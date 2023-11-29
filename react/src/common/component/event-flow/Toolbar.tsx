import React, { useState } from "react";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPaste, faCopy } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import useToast from "../../hooks/Toast";
import ActionDelete from "./modals/ActionDelete";
import { copyFunction, getCopiedFunction } from "./helper/Clipboard";
import {
    ButtonStateProps,
    NodeDataProps,
    ParentFunctionProps,
} from "./EventFlow";
import { getActionFormatVariableByParameter } from "../helper/Function";

// TODO: Don't import anything outside event-flow folder
//       EventFlowPanel component is the one using eventflow, not the eventflow using EventFlowPanel
import { ShapeClickedDataProps } from "../EventFlowPanel";

type ToolbarProps = {
    selectedFunction: ShapeClickedDataProps | null;
    onUpdate: (index: number, data: NodeDataProps, type?: string) => void;
    selectedParentFunction: ParentFunctionProps | null;
    buttonState: ButtonStateProps;
};

const Toolbar = ({
    selectedFunction,
    onUpdate,
    selectedParentFunction,
    buttonState,
}: ToolbarProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);
    const [deleteModalVisible, setDeleteVisibility] = useState<boolean>(false);

    const showDeleteModal = () => setDeleteVisibility(true);
    const hideDeleteModal = () => setDeleteVisibility(false);

    // Deletes a function
    const handleDelete = () => {
        if (selectedFunction) {
            onUpdate(
                selectedFunction.flowIndex,
                {
                    uuid: selectedFunction.data.uuid,
                },
                "delete"
            );
        }
    };

    // Paste a function
    const handlePaste = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        const result = getCopiedFunction();
        if (result.error) {
            toastMessage(result.message, toast.TYPE.ERROR);
        } else if (selectedParentFunction) {
            onUpdate(selectedParentFunction.flowIndex, {
                parentUuid: selectedParentFunction?.function_uuid || "#none",
                connectionName: selectedParentFunction?.connection_name || "",
                functionData: result?.data?.func,
            });
        }
    };

    // Copy a function
    const handleCopy = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        if (selectedFunction) {
            const result = copyFunction(selectedFunction.data);
            toastMessage(
                result.message,
                result.error ? toast.TYPE.ERROR : toast.TYPE.SUCCESS
            );
        }
    };

    return (
        <div className="toolbar d-flex justify-content-end align-items-center">
            <div className="toolbar-icons m-2">
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{t("common.button.delete")}</Tooltip>}
                >
                    <button
                        disabled={buttonState.delete}
                        type="button"
                        aria-label={t("common.button.delete")}
                        draggable="false"
                        className={`float-end border-0 bg-transparent ${
                            buttonState.delete ? "" : "text-granite-gray"
                        }`}
                        onClick={(e) => {
                            e.preventDefault();
                            showDeleteModal();
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </OverlayTrigger>
                <ActionDelete
                    show={deleteModalVisible}
                    handleClose={hideDeleteModal}
                    onConfirm={handleDelete}
                    name={
                        selectedFunction
                            ? `"${getActionFormatVariableByParameter(
                                  selectedFunction?.data,
                                  "function"
                              )}" function?`
                            : "this item?"
                    }
                />

                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{t("common.button.paste")}</Tooltip>}
                >
                    <button
                        disabled={buttonState.paste}
                        type="button"
                        aria-label={t("common.button.paste")}
                        draggable="false"
                        className={`float-end border-0 bg-transparent ${
                            buttonState.paste ? "" : "text-granite-gray"
                        }`}
                        onClick={handlePaste}
                    >
                        <FontAwesomeIcon icon={faPaste} />
                    </button>
                </OverlayTrigger>

                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{t("common.button.copy")}</Tooltip>}
                >
                    <button
                        disabled={buttonState.copy}
                        type="button"
                        aria-label={t("common.button.copy")}
                        draggable="false"
                        className={`float-end border-0 bg-transparent ${
                            buttonState.copy ? "" : "text-granite-gray"
                        }`}
                        onClick={handleCopy}
                    >
                        <FontAwesomeIcon icon={faCopy} />
                    </button>
                </OverlayTrigger>
            </div>
        </div>
    );
};

export default Toolbar;
