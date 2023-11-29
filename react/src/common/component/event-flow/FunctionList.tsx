import React, { useState } from "react";
import { nanoid } from "nanoid";
import { Row, Col, Container, Accordion, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import useDebounce from "../../hooks/Debounce";
import { CategoryProps, FunctionListsProps } from "./data/Functions";

type FunctionListProps = {
    functionLists: FunctionListsProps;
    isClickable?: boolean;
    type?: string;
    onClick?: (key: string) => void;
};

type FunctionProps = {
    list: CategoryProps;
    isClickable?: boolean;
    onClick?: (key: string) => void;
};

type FunctionGroupProps = {
    functionLists: FunctionListsProps;
    isClickable?: boolean;
    onClick?: (key: string) => void;
};

type FunctionFilterProps = {
    functionLists: FunctionListsProps;
    keyword: string;
    isClickable?: boolean;
    onClick?: (key: string) => void;
};

type FunctionDivProps = {
    isClickable?: boolean;
    handleDragStart: (
        e: React.DragEvent<HTMLDivElement>,
        functionName: string
    ) => void;
    handleClick: (
        e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLDivElement>,
        functionName: string
    ) => void;
    funcName: string;
};

const FunctionDiv = ({
    isClickable,
    handleDragStart,
    handleClick,
    funcName,
}: FunctionDivProps) => {
    return (
        <div
            key={`${funcName}-${nanoid()}`}
            role="button"
            tabIndex={0}
            draggable={!isClickable}
            onDragStart={(e) => handleDragStart(e, funcName)}
            onClick={(e) => handleClick(e, funcName)}
            onKeyDown={(e) => handleClick(e, funcName)}
            className={`fn-name ${isClickable ? "function-list" : ""}`}
            style={{ cursor: isClickable ? "pointer" : "move" }}
            data-function={funcName}
        >
            {funcName}
        </div>
    );
};

/**
 * Returns the functions
 */
const Function = ({ isClickable, list, onClick }: FunctionProps) => {
    const { t } = useTranslation();

    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        functionName: string
    ) => {
        e.dataTransfer.setData("Text", functionName);
        e.dataTransfer.setData("Origin", "Function");
    };

    const handleClick = (
        e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLDivElement>,
        functionName: string
    ) => {
        if (!isClickable || !functionName) return;

        // Close EventFlowFunctionLists modal and proceed to select the function
        if (onClick) {
            onClick(functionName);
        }
    };

    const listKeys = Object.keys(list);
    if (listKeys.length > 0) {
        const listDivs = listKeys.map((funcName) => {
            return (
                <FunctionDiv
                    key={`${funcName}-${nanoid()}`}
                    isClickable={isClickable}
                    handleDragStart={handleDragStart}
                    handleClick={handleClick}
                    funcName={funcName}
                />
            );
        });
        return <div>{listDivs}</div>;
    }
    return (
        <div className="fn-empty">
            {t("eventFlow.tabs.action.functionList.empty")}
        </div>
    );
};

/**
 * Returns the functions in group
 */
const FunctionGroup = ({
    functionLists,
    isClickable,
    onClick,
}: FunctionGroupProps) => {
    const list = functionLists;
    return (
        <Accordion>
            {Object.keys(list).map((group) => {
                const funclist = list[group];

                return (
                    <Card className="mb-1" key={group}>
                        <Accordion.Item eventKey={group}>
                            <Accordion.Header>{group}</Accordion.Header>
                            <Accordion.Body className="p-1">
                                <Card.Body>
                                    <Function
                                        list={funclist}
                                        isClickable={isClickable}
                                        onClick={onClick}
                                    />
                                </Card.Body>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Card>
                );
            })}
        </Accordion>
    );
};

/**
 * Filters the functions by passing a search keyword
 */
const FunctionFilter = ({
    functionLists,
    isClickable,
    keyword,
    onClick,
}: FunctionFilterProps) => {
    const { t } = useTranslation();
    const list = functionLists;
    const functions: JSX.Element[] = [];

    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        functionName: string
    ) => {
        e.dataTransfer.setData("Text", functionName);
        e.dataTransfer.setData("Origin", "Function");
    };

    const handleClick = (
        e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLDivElement>,
        functionName: string
    ) => {
        if (!isClickable || !functionName) return;

        // Close EventFlowFunctionLists modal and proceed to select the function
        if (onClick) {
            onClick(functionName);
        }
    };

    // Loop through functions from the list
    Object.keys(list).forEach((group) => {
        const funclist = list[group];
        Object.keys(funclist).forEach((funcName) => {
            // Check if this function matches search keyword
            if (funcName.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
                functions.push(
                    <FunctionDiv
                        key={`${funcName}-${nanoid()}`}
                        isClickable={isClickable}
                        handleDragStart={handleDragStart}
                        handleClick={handleClick}
                        funcName={funcName}
                    />
                );
            }
        });
    });

    return (
        <div>
            {functions.length > 0 ? (
                functions
            ) : (
                <div className="fn-empty">
                    {t("eventFlow.tabs.action.functionList.notFound", {
                        keyword,
                    })}
                </div>
            )}
        </div>
    );
};

/**
 * Component for functions list
 */

const FunctionList = ({
    functionLists,
    isClickable,
    type,
    onClick,
}: FunctionListProps) => {
    const { t } = useTranslation();
    // Use debounce to delay the setting of a value
    const [searchText, setSearchText] = useState("");

    // Ensure search happens only when typing is finished
    const debouncedSearchText = useDebounce(searchText);

    return (
        <div className={`${type === "global" ? "h-250" : "h-320"} funclist`}>
            <Container className="mt-2 mb-2">
                <Row>
                    <Col lg="12">
                        <input
                            type="text"
                            className="form-control h-30 text-rg text-italic"
                            placeholder={t("common.text.search")}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>
                </Row>
            </Container>
            <Container className="overflow-auto h-90 pt-2">
                <Row>
                    <Col lg="12">
                        {debouncedSearchText ? (
                            <FunctionFilter
                                functionLists={functionLists}
                                keyword={debouncedSearchText}
                                isClickable={isClickable}
                                onClick={onClick}
                            />
                        ) : (
                            <FunctionGroup
                                functionLists={functionLists}
                                isClickable={isClickable}
                                onClick={onClick}
                            />
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default FunctionList;
