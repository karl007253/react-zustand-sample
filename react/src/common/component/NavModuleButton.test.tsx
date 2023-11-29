import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import NavModuleButton from "./NavModuleButton";

describe("Component: NavModuleButton", () => {
    const url = "/api";

    beforeEach(() => {
        render(
            <NavModuleButton
                name="api"
                image="/image.png"
                imageActive="/image-active.png"
                imageTitle="image"
                url={url}
                selected
            />,
            { wrapper: MemoryRouter }
        );
    });

    it("should have an image", () => {
        expect(
            screen.getByRole("img", { name: "api-img" })
        ).toBeInTheDocument();
    });

    it("should be selected", () => {
        expect(
            screen.getByRole("img", { name: "api-img" }).parentElement
                ?.firstChild
        ).toHaveClass("module-icon-bridge");
    });

    it("should have a link to /api", () => {
        expect(
            screen.getByRole("img", { name: "api-img" }).parentElement
        ).toHaveAttribute("href", url);
    });
});
