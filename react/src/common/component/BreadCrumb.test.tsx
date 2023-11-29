import { render, screen } from "@testing-library/react";
import { Api } from "../zustand/interface/ApiInterface";
import { Folder, FolderType } from "../zustand/interface/FolderInterface";
import useStore from "../zustand/Store";
import BreadCrumb from "./BreadCrumb";

// prepare simple first level folder
const fakeFolder: Folder = {
    name: "test",
    order: 0,
    title: "testname",
    type: FolderType.API,
    uuid: "unique-folder",
};

// prepare folder with parent
const fakeChildFolder: Folder = {
    name: "child",
    order: 0,
    title: "testchild",
    type: FolderType.API,
    uuid: "unique-parent",
    folder_uuid: fakeFolder.uuid,
};

// prepare a fake api under all folders
const fakeApiAction: Api = {
    name: "file",
    order: 0,
    title: "testchild",
    uuid: "unique-file",
    folder_uuid: fakeChildFolder.uuid, // use child folder
};

// set zustand state first with fake data
useStore.setState({
    folder: [fakeFolder, fakeChildFolder],
});

const renderWithData = (data: Folder | Api) => {
    render(<BreadCrumb selectedItem={data} module="api" />);
};

const verifyPathContentByIndex = (index: number, content: string) => {
    // Get all paths by getting all list items
    const path = screen.getAllByRole("listitem");

    // ensure path index to be the exact text content
    expect(path[index].textContent).toBe(content);
};

describe("Component: Breadcrumb", () => {
    it("should render correct folder path without parent", () => {
        // render folder without parent
        renderWithData(fakeFolder);

        // ensure name is on the first index
        verifyPathContentByIndex(0, fakeFolder.name);
    });

    it("should render correct folder path with parent", () => {
        // render folder with parent
        renderWithData(fakeChildFolder);

        // ensure first index is the parent folder name
        verifyPathContentByIndex(0, fakeFolder.name);

        // ensure last index is the child folder name
        verifyPathContentByIndex(1, fakeChildFolder.name);
    });

    it("should render correct file path", () => {
        // render folder with parent
        renderWithData(fakeApiAction);

        // ensure first index is the parent folder name
        verifyPathContentByIndex(0, fakeFolder.name);

        // ensure second index is the child folder name
        verifyPathContentByIndex(1, fakeChildFolder.name);

        // ensure last index is the api name
        verifyPathContentByIndex(2, fakeApiAction.name);
    });
});
