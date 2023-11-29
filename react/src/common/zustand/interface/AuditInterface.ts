import { HttpResponse } from "../../helper/HttpRequest";
/**
 * TODO:
 * Please be reminded that all the interfaces are just a temporary baseline.
 * Please feel free to modify them in future development to fit your need.
 */

interface AuditReleaseAndBuild {
    year: number;
    month: number;
    tags: string;
    count: number;
}

interface AuditSlice {
    releasesAndBuild: AuditReleaseAndBuild[];
    getReleasesAndBuildByApplicationCode: (
        applicationCode: string
    ) => Promise<HttpResponse<AuditReleaseAndBuild[]>>;
}

export type { AuditReleaseAndBuild };
export default AuditSlice;
