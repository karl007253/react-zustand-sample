import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateModulePlaceholder from "./CreateModulePlaceholder";

const createButton = () => {
    return screen.getByRole("button", {
        name: "common.button.create",
    });
};

const imagePlaceholder = () => {
    return screen.getByRole("img", { name: "placeholder-image" });
};

const containerButton = () => {
    return screen.getByRole("button", {
        name: "placeholder-image common.button.create",
    });
};

describe("Component: CreateModulePlaceholder", () => {
    // prepare mock images
    const fakeImage = "sample-image.jpg";
    const fakeHoverImage = "sample-hover-image.jpg";

    // prepare mock onClick method
    const mockOnCreate = jest.fn();

    beforeEach(() => {
        render(
            <CreateModulePlaceholder
                image={fakeImage}
                onHoverImage={fakeHoverImage}
                onClick={mockOnCreate}
            />
        );
    });

    it("should have show the initial image", () => {
        expect(imagePlaceholder()).toHaveAttribute("src", fakeImage);
    });

    it("should have a button that triggers onClick", () => {
        // trigger create button
        userEvent.click(createButton());

        // ensure onClick has been called
        expect(mockOnCreate).toBeCalledTimes(1);
    });

    it("should have the correct image on hover", () => {
        // trigger hover effect
        userEvent.hover(containerButton());

        // ensure hover image is active
        expect(imagePlaceholder()).toHaveAttribute("src", fakeHoverImage);

        // ensure button has active class
        expect(createButton()).toHaveClass(
            "bg-emobiq-brand text-white border-emobiq-brand"
        );
    });
});
