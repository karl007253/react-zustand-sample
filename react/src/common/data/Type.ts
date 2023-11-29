/**
 * These contains types and interfaces within the project
 */

export type ModuleType = "API" | "DATABASE" | "SCHEDULER";

export type Sort = {
    uuid: string;
    parent?: string;
    order: number;
};
