import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Storage from "./Storage";
import useStore from "../../../common/zustand/Store";
import { StorageInfoMemory } from "../../../common/zustand/interface/ApplicationInterface";
import { byteToMB } from "../../../common/helper/Memory";

describe("Dashboard: Storage", () => {
    const mockStorageInfoMemory: StorageInfoMemory = {
        max: 100,
        used: 0,
        free: 100,
    };

    beforeEach(async () => {
        // set mock data
        useStore.setState({
            storageInfo: {
                memory: mockStorageInfoMemory,
            },
        });

        await act(async () => {
            render(<Storage />);
        });
    });

    it("should have a Storage title ", () => {
        expect(
            screen.getByRole("heading", {
                name: "dashboard.title.storage",
            })
        ).toBeInTheDocument();
    });

    it("should have a three components with storage class name", () => {
        const { container } = render(<Storage />);
        const components = container.getElementsByClassName("storage");
        expect(components.length).toBe(3);
    });

    it("should show max, remaining, and used memory accordingly with current storage", () => {
        // Show max, used, and remaining memory
        const maxStorageMB = byteToMB(mockStorageInfoMemory.max);
        const usedStorageMB = byteToMB(mockStorageInfoMemory.used);
        const remainingStorageMB = byteToMB(mockStorageInfoMemory.free);
        expect(
            screen.getByTestId("storage-dashboard.storage.current")
        ).toHaveTextContent(`${maxStorageMB}MB`);
        expect(
            screen.getByTestId("storage-dashboard.storage.used")
        ).toHaveTextContent(`${usedStorageMB}MB`);
        expect(
            screen.getByTestId("storage-dashboard.storage.remaining")
        ).toHaveTextContent(`${remainingStorageMB}MB`);
    });
});
