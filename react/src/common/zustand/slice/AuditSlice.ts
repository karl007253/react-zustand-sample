import { StateCreator } from "zustand";

import httpRequest, { HttpResponse } from "../../helper/HttpRequest";
import AuditSlice, { AuditReleaseAndBuild } from "../interface/AuditInterface";

const createAuditSlice: StateCreator<
    AuditSlice,
    [["zustand/devtools", never]]
> = (setState) => ({
    releasesAndBuild: [],

    // Get Releases and Build data by application_code
    getReleasesAndBuildByApplicationCode: async (applicationCode: string) => {
        const result = await httpRequest.get<
            void,
            HttpResponse<AuditReleaseAndBuild[]>
        >(`/v1/audits/releases-and-build/${applicationCode}`);

        if (result.success && result.data) {
            setState(
                {
                    releasesAndBuild: result.data ?? [],
                },
                false,
                "getApplicationReleasesAndBuild"
            );
        }

        return result;
    },
});

export default createAuditSlice;
