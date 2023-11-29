/**
 * These contains all the constant declaration or variables within the project
 */

// For Cookies Stuff
export const COOKIE_EXPIRY_SUFFIX = "-expiry";

// For APIs Stuff
export const API_TOKEN = process.env.REACT_APP_API_TOKEN || "_em_sid";

export const APP_ICON_MAX_SIZE = 1048576; /* 1 MB */
export const APP_ICON_FILE_TYPE = ["image/jpeg", "image/png"];

// API Prefix
export const CONFIGURATION_PREFIX = "CONFIGURATION";

// API Prefix
export const API_PREFIX = "API";

// FOLDER Prefix
export const FOLDER_PREFIX = "FOLDER";

// DATABASE Prefix
export const DATABASE_PREFIX = "DATABASE";

// TABLE Prefix
export const TABLE_PREFIX = "TABLE";

// TABLE_FIELD Prefix
export const TABLE_FIELD_PREFIX = "TABLE_FIELD";

// The id of the root database
export const DATABASE_PARENT = "DATABASE_PARENT";

// ACTION Prefix
export const ACTION_PREFIX = "ACTION";

// SCHEDULER Prefix
export const SCHEDULER_PREFIX = "SCHEDULER";

// SERVICE Prefix
export const SERVICE_PREFIX = "SERVICE";

// TABLE_RECORD Prefix
export const TABLE_RECORD_PREFIX = "TABLE_RECORD";

// TABLE_RECORD_FIELD Prefix
export const TABLE_RECORD_FIELD_PREFIX = "TABLE_RECORD_FIELD";

// GUTTER_SIZE the size of service components gutter part
export const GUTTER_SIZE = 10;

// regex for checking special characters except for - and _
export const SPECIAL_CHARACTERS_REGEX = /^[a-zA-Z0-9_-]+$/;

// Default name for Root Database Configuration
export const ROOT_DATABASE_CONFIGURATION_NAME = "ROOT_DB_CONFIG";
