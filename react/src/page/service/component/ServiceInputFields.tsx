import { Col, Form, Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import _, { capitalize } from "lodash";

import { TFunction, useTranslation } from "react-i18next";
import {
    ServiceAttributes,
    ServiceAttributesOptions,
    serviceElementStructure,
} from "../../../common/data/Service";
import { Service } from "../../../common/zustand/interface/ServiceInterface";

import useToast from "../../../common/hooks/Toast";
import String from "./elements/String";
import Option from "./elements/Option";
import Boolean from "./elements/Boolean";
import Number from "./elements/Number";
import DatabaseConnectorDatabase from "./elements/DatabaseConnectorDatabase";
import DatabaseTableConnector from "./elements/DatabaseTableConnector";
import DatabaseTableTable from "./elements/DatabaseTableTable";
import { validateSpecialCharacters } from "../../../common/helper/Function";

type ServiceInputFieldsProps = {
    index: number;
    service: Service;
    services: Service[];
    onUpdateAttributes: (
        isName: boolean,
        uuid: string,
        field: string,
        data: string
    ) => void;
};

type ServiceElementsProps = {
    className: string;
    index: number;
    attrName: string;
    attrType?: string;
    serviceData: Service;
    onUpdateAttributes: (
        isName: boolean,
        uuid: string,
        field: string,
        data: string
    ) => void;
    handleValidation?: (
        attributeName: string,
        attributeData: ServiceAttributes
    ) => boolean;
    options?: ServiceAttributesOptions[];
    services?: Service[];
};

// validateServiceProperties validating the service attributes
const validateServiceAttributes = (
    dataIndex: number,
    attributeName: string,
    attributeData: ServiceAttributes,
    allServices: Service[],
    t: TFunction // add the t function as a parameter
): { status: boolean; message: string } => {
    let validationPassed = true;
    let message = "";
    if (attributeName === "name") {
        if (attributeData?.value === "") {
            // check for empty name
            validationPassed = false;
            message = t("service.modal.form.error.required.name");
        } else {
            if (validateSpecialCharacters(attributeData?.value as string)) {
                // check for special characters
                validationPassed = false;
                message = t("common.error.specialCharactersDetectedSpecific", {
                    field: capitalize(attributeName),
                });
            }

            for (let i = 0; i < allServices.length; i++) {
                // check for duplicate name
                if (
                    allServices[i].name === attributeData?.value &&
                    dataIndex !== i
                ) {
                    validationPassed = false;
                    message = t(
                        "service.modal.form.error.nameExist",
                        attributeData?.value
                    );
                    break;
                }
            }
        }
    } else if (
        attributeData.isRequired &&
        (attributeData.value === null || attributeData.value === "")
    ) {
        // check if field is required
        validationPassed = false;
        message = `${attributeName} field is required.`;
    }

    return { status: validationPassed, message };
};

const ServiceInputFields = ({
    index,
    service,
    services,
    onUpdateAttributes,
}: ServiceInputFieldsProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);
    const component = serviceElementStructure[service.type];

    const handleValidation = (
        attributeName: string,
        attributeData: ServiceAttributes
    ) => {
        const validationResult = validateServiceAttributes(
            index,
            attributeName,
            attributeData,
            services,
            t
        );
        if (!validationResult.status) {
            toastMessage(validationResult.message, toast.TYPE.ERROR);
        }
        return validationResult.status;
    };

    const prepareFields = () => {
        const inputFields: JSX.Element[] | null = [
            <Stack
                className="service-card-field-container"
                direction="horizontal"
                key="name"
            >
                <Col sm={4}>
                    <Form.Label>Name</Form.Label>
                </Col>
                <Col sm={8}>
                    <String
                        className="form-control"
                        index={index}
                        attrName="name"
                        serviceData={service}
                        onUpdateAttributes={onUpdateAttributes}
                        handleValidation={handleValidation}
                        services={services}
                    />
                </Col>
            </Stack>,
        ];

        Object.keys(component.attribute).forEach((attrName) => {
            const attrType = component.attribute[attrName].type;
            let element: JSX.Element | null;

            switch (attrType) {
                case "string":
                    element = (
                        <String
                            className="form-control"
                            index={index}
                            attrName={attrName}
                            attrType={attrType}
                            serviceData={service}
                            onUpdateAttributes={onUpdateAttributes}
                            handleValidation={handleValidation}
                            options={component.attribute[attrName].options}
                            services={services}
                        />
                    );
                    break;
                case "options":
                    element = (
                        <Option
                            className="form-control"
                            index={index}
                            attrName={attrName}
                            attrType={attrType}
                            serviceData={service}
                            onUpdateAttributes={onUpdateAttributes}
                            handleValidation={handleValidation}
                            options={component.attribute[attrName].options}
                            services={services}
                        />
                    );
                    break;
                case "number":
                    element = (
                        <Number
                            className="form-control"
                            index={index}
                            attrName={attrName}
                            attrType={attrType}
                            serviceData={service}
                            onUpdateAttributes={onUpdateAttributes}
                            handleValidation={handleValidation}
                            options={component.attribute[attrName].options}
                            services={services}
                        />
                    );
                    break;
                case "boolean":
                    element = (
                        <Boolean
                            className="form-control"
                            index={index}
                            attrName={attrName}
                            attrType={attrType}
                            serviceData={service}
                            onUpdateAttributes={onUpdateAttributes}
                            handleValidation={handleValidation}
                            services={services}
                        />
                    );
                    break;
                case "databaseConnectorDatabase":
                    element = (
                        <DatabaseConnectorDatabase
                            className="form-control"
                            index={index}
                            attrName={attrName}
                            attrType={attrType}
                            serviceData={service}
                            onUpdateAttributes={onUpdateAttributes}
                            handleValidation={handleValidation}
                            services={services}
                        />
                    );
                    break;
                case "databaseTableConnector":
                    element = (
                        <DatabaseTableConnector
                            className="form-control"
                            index={index}
                            attrName={attrName}
                            attrType={attrType}
                            serviceData={service}
                            onUpdateAttributes={onUpdateAttributes}
                            handleValidation={handleValidation}
                            services={services}
                        />
                    );
                    break;
                case "databaseTableTable":
                    element = (
                        <DatabaseTableTable
                            className="form-control"
                            index={index}
                            attrName={attrName}
                            attrType={attrType}
                            serviceData={service}
                            onUpdateAttributes={onUpdateAttributes}
                            handleValidation={handleValidation}
                            services={services}
                        />
                    );
                    break;
                default:
                    element = null;
                    break;
            }

            inputFields.push(
                <Stack
                    className="service-card-field-container"
                    direction="horizontal"
                    key={attrName}
                >
                    <Col sm={4}>
                        <Form.Label>{_.capitalize(attrName)}</Form.Label>
                    </Col>
                    <Col sm={8}>{element}</Col>
                </Stack>
            );
        });

        return inputFields;
    };

    return <>{prepareFields()}</>;
};

export type { ServiceElementsProps };

export default ServiceInputFields;
