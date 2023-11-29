import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type NavModuleButtonProps = {
    name: string;
    image: string;
    imageActive: string;
    imageTitle: string;
    selected: boolean;
    url: string;
};

const NavModuleButton = ({
    name,
    image,
    imageActive,
    imageTitle,
    selected,
    url,
}: NavModuleButtonProps) => {
    const { t } = useTranslation();

    return (
        <div className="icon-holder p-0 gx-0 position-relative">
            <Link to={url}>
                {selected ? (
                    <>
                        <div className="module-icon-bridge" />
                        <img
                            aria-label={`${name}-img`}
                            className="module-icon top-0 start-0"
                            src={imageActive}
                            alt={t(imageTitle)}
                        />
                    </>
                ) : (
                    <img
                        aria-label={`${name}-img`}
                        className="module-icon top-0 start-0"
                        src={image}
                        alt={t(imageTitle)}
                    />
                )}
                <img
                    aria-label={`${name}-img-active`}
                    className="module-icon top-0 start-0 position-absolute"
                    src={imageActive}
                    alt={t(imageTitle)}
                />
            </Link>
        </div>
    );
};

export default NavModuleButton;
