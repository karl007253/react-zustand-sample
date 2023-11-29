import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

type CreateModulePlaceholderProps = {
    image: string;
    onHoverImage: string;
    onClick: () => void;
};

/**
 * Reusable Create Module Placeholder component
 * will render a button with an image
 * @param {string} image image url or image component
 * @param {string} onHoverImage image url or image component
 * @param {() => void} onClick onClick event
 *
 * Usage:
 *
 * <CreateModulePlaceholder
 *      image={"link-to-image.jpg"}
 *      onHoverImage={"link-to-image.jpg"}
 *      onClick={createHandler}
 * />
 *
 * Using SVG:
 *
 * import { ReactComponent as YourSVG } from "svg-directory.svg"
 *
 * <CreateModulePlaceholder
 *      image={YourSVG}
 *      onHoverImage={YourSVG}
 *      onClick={createHandler}
 * />
 */
const CreateModulePlaceholder = ({
    image,
    onHoverImage,
    onClick,
}: CreateModulePlaceholderProps) => {
    const { t } = useTranslation();

    const [active, setActive] = useState<boolean>(false);

    return (
        <Row className="justify-content-center">
            <Col
                role="button"
                onMouseEnter={() => setActive(true)}
                onMouseLeave={() => setActive(false)}
                onClick={onClick}
                className="mw-500 w-100 text-center"
            >
                <Image
                    aria-label="placeholder-image"
                    src={active ? onHoverImage : image}
                />

                <Button
                    variant="outline-light-emobiq-brand"
                    className={`btn btn-outline-light-emobiq-brand px-50 mt-4 text-lg${
                        active
                            ? " bg-emobiq-brand text-white border-emobiq-brand"
                            : ""
                    }`}
                >
                    <FontAwesomeIcon icon={faCog} className="me-3" />
                    {t("common.button.create")}
                </Button>
            </Col>
        </Row>
    );
};

export default CreateModulePlaceholder;
