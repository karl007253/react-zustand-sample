import { Button, Col, Form, Row, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import _ from "lodash";

import { toast } from "react-toastify";
import useStore from "../../../common/zustand/Store";
import {
    ApiData,
    RequestHeader,
} from "../../../common/zustand/interface/ApiInterface";

import { ButtonVariant } from "../../../common/component/helper/EmobiqModal";
import useDebounce from "../../../common/hooks/Debounce";
import { validateSpecialCharacters } from "../../../common/helper/Function";
import useToast from "../../../common/hooks/Toast";

type ApiHeaderProps = {
    requestMethod: keyof ApiData;
};

const ApiHeader = ({ requestMethod }: ApiHeaderProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);

    const { selectedApi, updateApiHeader } = useStore((state) => ({
        selectedApi: state.api.find((a) => a.uuid === state.selectedApiUuid),
        updateApiHeader: state.updateApiHeader,
    }));

    const [headers, setHeaders] = useState<RequestHeader[]>([]);

    // Ensure header list is updated only when user typing is completed
    const debouncedHeaders = useDebounce(headers);

    // Reset headers when selectedApi is changed or a new requestMethod is selected
    useEffect(() => {
        setHeaders(selectedApi?.data?.[requestMethod]?.header || []);
    }, [selectedApi?.uuid, requestMethod]);

    // Update header list in global state if applicable
    useEffect(() => {
        // Ensure only valid data is saved in the global state by removing all data with empty type
        const newHeaders = debouncedHeaders.filter(
            ({ type }) => type?.length > 0
        );

        // Prepare current header list. Empty list is used if current header list is undefined.
        const currentHeader = selectedApi?.data?.[requestMethod]?.header || [];

        // Return true if current header list's length is greater than new header list's length
        const isCurrentHeaderGreaterThanNewHeader =
            currentHeader.length > newHeaders.length;

        // Return true if current header list is different from new header list
        const isHeaderUpdated = newHeaders.some((header, index) => {
            if (currentHeader[index]) {
                // Verify if a header is found in current header list and consequently, compare the header in current header list and new header list
                return !_.isEqual(header, currentHeader[index]);
            }

            // Return true if the header is newly created
            return true;
        });

        if (isCurrentHeaderGreaterThanNewHeader || isHeaderUpdated) {
            updateApiHeader(requestMethod, newHeaders);
        }
    }, [debouncedHeaders]);

    // handle deleting a header item
    const handleDelete = (index: number) => {
        // Remove the deleted header from header list
        const newHeaders = headers.filter((header, i) => i !== index);

        setHeaders(newHeaders);
    };

    // handle updating the input field of type
    const handleUpdateType = (index: number, type: string) => {
        if (type.length > 0) {
            // Checking for special characters
            if (validateSpecialCharacters(type)) {
                toastMessage(
                    t("common.error.specialCharactersDetected"),
                    toast.TYPE.ERROR
                );
            } else {
                // Update type of specific header if the type is not an empty string
                const newHeaders = headers.map((header, i) =>
                    i === index ? { ...header, type } : header
                );
                setHeaders(newHeaders);
            }
        } else {
            // Remove the header from header list if the type is an empty string
            handleDelete(index);
        }
    };

    // handle updating the input field of value
    const handleUpdateValue = (index: number, value: string) => {
        // Checking for special characters and empty string
        if (validateSpecialCharacters(value) && value !== "") {
            toastMessage(
                t("common.error.specialCharactersDetected"),
                toast.TYPE.ERROR
            );
        } else {
            // Update value of specific header
            const newHeaders = headers.map((header, i) =>
                i === index ? { ...header, value } : header
            );

            setHeaders(newHeaders);
        }
    };

    // add a new empty header
    const handleAdd = () => {
        setHeaders([...headers, {} as RequestHeader]);
    };

    return (
        <Container className="px-0">
            <Row className="text-spanish-gray text-rg mb-4">
                <Col xs={4} lg={3}>
                    {t("api.dashboard.action.header.type")}
                </Col>
                <Col xs={5} lg={4}>
                    {t("api.dashboard.action.header.value")}
                </Col>
                <Col xs={3} lg={5} />
            </Row>

            {headers.map((header, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Row className="mb-4" key={index}>
                    <Col xs={4} lg={3}>
                        <Form.Control
                            aria-label={`api-header-input-type-${index}`}
                            className="text-sm"
                            onChange={(e) =>
                                handleUpdateType(index, e.target.value)
                            }
                            value={header?.type ?? ""}
                        />
                    </Col>
                    <Col xs={5} lg={4}>
                        <Form.Control
                            aria-label={`api-header-input-value-${index}`}
                            className="text-sm"
                            onChange={(e) =>
                                handleUpdateValue(index, e.target.value)
                            }
                            value={header?.value ?? ""}
                        />
                    </Col>
                    <Col xs={3} lg={5}>
                        <Button
                            aria-label={`api-header-delete-button-${index}`}
                            variant={ButtonVariant.OUTLINE_CHINESE_SILVER}
                            onClick={() => {
                                handleDelete(index);
                            }}
                            className="text-rg rounded-3-px"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </Col>
                </Row>
            ))}

            <Button
                variant={ButtonVariant.OUTLINE_LIGHT_EMOBIQ_BRAND}
                onClick={handleAdd}
                className="text-sm"
            >
                <FontAwesomeIcon icon={faPlus} />
                <span className="ms-2">
                    {t("api.dashboard.action.header.button.add")}
                </span>
            </Button>
        </Container>
    );
};

export default ApiHeader;
