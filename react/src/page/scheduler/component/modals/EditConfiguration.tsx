import {
    Button,
    Col,
    Form,
    Row,
    Container,
    InputGroup,
    Stack,
} from "react-bootstrap";

import { useState, useEffect, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useFormik, validateYupSchema, yupToFormErrors } from "formik";
import * as Yup from "yup";
import { ValidationError } from "yup";

import useStore from "../../../../common/zustand/Store";
import useToast from "../../../../common/hooks/Toast";
import EmobiqModal, {
    ButtonVariant,
    EmobiqModalSize,
} from "../../../../common/component/helper/EmobiqModal";

import useActiveConfiguration from "../../../../common/hooks/ActiveConfiguration";
import useDebounce from "../../../../common/hooks/Debounce";
import generateUniqueId from "../../../../common/helper/UniqueId";

import {
    CONFIGURATION_PREFIX,
    SPECIAL_CHARACTERS_REGEX,
} from "../../../../common/data/Constant";
import {
    Configuration,
    ConfigurationType,
    SchedulerConfigurationData,
} from "../../../../common/zustand/interface/ConfigurationInterface";
import EditConfigurationMenu from "./configuration/EditConfigurationMenu";
import EditConfigurationDeletePopover from "./configuration/EditConfigurationDeletePopover";

interface EditConfigurationForm {
    uuid: string;
    name: string;
}

type EditConfigurationProps = {
    show: boolean;
    handleClose: () => void;
};

const EditConfiguration = ({ show, handleClose }: EditConfigurationProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);

    const {
        addNewConfiguration,
        deleteConfiguration,
        updateConfiguration,
        setSelectedConfiguration,
        configuration,
        selectedScheduler,
        selectedSchedulerFolder,
        scheduler,
        folder,
        selectedSchedulerFolderUuid,
    } = useStore((state) => ({
        addNewConfiguration: state.addNewConfiguration,
        deleteConfiguration: state.deleteConfiguration,
        updateConfiguration: state.updateConfiguration,
        setSelectedConfiguration: state.setSelectedSchedulerConfiguration,
        configuration: state.configuration,
        selectedScheduler: state.scheduler.find(
            (a) => a.uuid === state.selectedSchedulerUuid
        ),
        selectedSchedulerFolder: state.folder.find(
            (f) => f.uuid === state.selectedSchedulerFolderUuid
        ),
        scheduler: state.scheduler,
        folder: state.folder,
        selectedSchedulerFolderUuid: state.selectedSchedulerFolderUuid,
    }));

    // Focused config inside the modal
    const [focusedConfig, setFocusedConfig] = useState<Configuration>(
        {} as Configuration
    );

    // Local list before being submitted to global state
    const [localConfigList, setLocalConfigList] = useState<Configuration[]>([]);

    const [searchInput, setSearchInput] = useState("");
    const [isUsed, setIsUsed] = useState("");
    const [isFolder, setIsFolder] = useState("");
    // Ensure search happens only when typing is finished
    const debouncedSearchInput = useDebounce(searchInput);

    // Get selected config
    const activeConfiguration = useActiveConfiguration(
        ConfigurationType.SCHEDULER
    );

    const days = [
        { day: "1", name: "mon", checked: false },
        { day: "2", name: "tue", checked: false },
        { day: "3", name: "wed", checked: false },
        { day: "4", name: "thu", checked: false },
        { day: "5", name: "fri", checked: false },
        { day: "6", name: "sat", checked: false },
        { day: "0", name: "sun", checked: false },
    ];

    const currentUnsavedConfig = localConfigList.find(
        (config) => config.name === ""
    );

    // TODO : Use only one state for all (hourly, daily, weekly, monthly and yearly)

    // set default scheduler state with the default crontab format "*"
    const [minute, setMinute] = useState("*");
    const [hour, setHour] = useState("*");
    const [dayMonth, setDayMonth] = useState("*");
    const [month, setMonth] = useState("*");
    const [dayWeek, setDayWeek] = useState("*");

    // initial state for the hourly schedule
    const [hourlyEveryHour, setHourlyEveryHour] = useState("1");
    const [hourlyStartsAtHour, setHourlyStartsAtHour] = useState("1");
    const [hourlyStartsAtMinute, setHourlyStartsAtMinute] = useState("0");
    const [hourlyStartsAtAmPm, setHourlyStartsAtAmPm] = useState("am");
    // initial state for the daily schedule
    const [optEveryday, setOptEveryday] = useState<boolean>(false);
    const [optEveryWeekday, setOptEveryWeekday] = useState<boolean>(false);
    const [optEveryWeekend, setOptEveryWeekend] = useState<boolean>(false);
    const [dailyStartsAtHour, setDailyStartsAtHour] = useState("1");
    const [dailyStartsAtMinute, setDailyStartsAtMinute] = useState("0");
    const [dailyStartsAtAmPm, setDailyStartsAtAmPm] = useState("am");
    // initial state for the weekly schedule
    const [optWeeklyDays, setOptWeeklyDays] = useState(days);
    const [optDays, setOptDays] = useState<string[]>([]);
    const [weeklyStartsAtHour, setWeeklyStartsAtHour] = useState("1");
    const [weeklyStartsAtMinute, setWeeklyStartsAtMinute] = useState("0");
    const [weeklyStartsAtAmPm, setWeeklyStartsAtAmPm] = useState("am");
    // initial state for the monthly schedule
    const [optMonthlyDay, setOptMonthlyDay] = useState<boolean>(false);
    const [optMonthlyWeek, setOptMonthlyWeek] = useState<boolean>(false);
    const [monthlyEveryDay, setMonthlyEveryDay] = useState("1");
    const [monthlyEveryMonth, setMonthlyEveryMonth] = useState("1");
    const [monthlyQuarter, setMonthlyQuarter] = useState("first");
    const [monthlyQuarterDay, setMonthlyQuarterDay] = useState("mon");
    const [monthlyQuarterMonth, setMonthlyQuarterMonth] = useState("1");
    const [monthlyStartsAtHour, setMonthlyStartsAtHour] = useState("1");
    const [monthlyStartsAtMinute, setMonthlyStartsAtMinute] = useState("0");
    const [monthlyStartsAtAmPm, setMonthlyStartsAtAmPm] = useState("am");
    // initial state for the yearly schedule
    const [optYearlyMonth, setOptYearlyMonth] = useState<boolean>(false);
    const [optYearlyWeek, setOptYearlyWeek] = useState<boolean>(false);
    const [yearlyEveryDay, setYearlyEveryDay] = useState("1");
    const [yearlyEveryMonth, setYearlyEveryMonth] = useState("1");
    const [yearlyQuarter, setYearlyQuarter] = useState("first");
    const [yearlyQuarterDay, setYearlyQuarterDay] = useState("mon");
    const [yearlyQuarterMonth, setYearlyQuarterMonth] = useState("jan");
    const [yearlyStartsAtHour, setYearlyStartsAtHour] = useState("1");
    const [yearlyStartsAtMinute, setYearlyStartsAtMinute] = useState("0");
    const [yearlyStartsAtAmPm, setYearlyStartsAtAmPm] = useState("am");

    const [activeTabeScheduler, setActiveTabeScheduler] = useState("hourly");

    const setDefaultCronFormat = () => {
        setMinute("0");
        setHour("1/1");
        setDayMonth("*");
        setMonth("*");
        setDayWeek("*");
    };

    const setCronFormat = (
        newMinute: string,
        newHour: string,
        newDayMonth: string,
        newMonth: string,
        newDayWeek: string
    ) => {
        setMinute(newMinute);
        setHour(newHour);
        setDayMonth(newDayMonth);
        setMonth(newMonth);
        setDayWeek(newDayWeek);
    };
    // set default the hourly scheduler
    const setDefaultHourly = () => {
        setHourlyEveryHour("1");
        setHourlyStartsAtHour("1");
        setHourlyStartsAtMinute("0");
        setHourlyStartsAtAmPm("am");
    };
    // set default the daily scheduler
    const setDefaultDaily = () => {
        setOptEveryday(false);
        setOptEveryWeekday(false);
        setOptEveryWeekend(false);
        setDailyStartsAtHour("1");
        setDailyStartsAtMinute("0");
        setDailyStartsAtAmPm("am");
    };
    // set default the weekly scheduler
    const setDefaultWeekly = () => {
        setOptWeeklyDays(days);
        setOptDays([]);
        setWeeklyStartsAtHour("1");
        setWeeklyStartsAtMinute("0");
        setWeeklyStartsAtAmPm("am");
    };
    // set default the monthly scheduler
    const setDefaultMonthly = () => {
        setOptMonthlyDay(false);
        setOptMonthlyWeek(false);
        setMonthlyEveryDay("1");
        setMonthlyEveryMonth("1");
        setMonthlyQuarter("first");
        setMonthlyQuarterDay("mon");
        setMonthlyQuarterMonth("1");
        setMonthlyStartsAtHour("1");
        setMonthlyStartsAtMinute("0");
        setMonthlyStartsAtAmPm("am");
    };
    // set default the yearly scheduler
    const setDefaultYearly = () => {
        setOptYearlyMonth(false);
        setOptYearlyWeek(false);
        setYearlyEveryDay("1");
        setYearlyEveryMonth("1");
        setYearlyQuarter("first");
        setYearlyQuarterDay("mon");
        setYearlyQuarterMonth("jan");
        setYearlyStartsAtHour("1");
        setYearlyStartsAtMinute("0");
        setYearlyStartsAtAmPm("am");
    };
    // set default all periodicity input
    const setDefaultAllInput = () => {
        setDefaultCronFormat();
        setDefaultHourly();
        setDefaultDaily();
        setDefaultWeekly();
        setDefaultMonthly();
        setDefaultYearly();
    };

    const convertAmPmTo24 = (inputHour: string, inputAmPm: string) => {
        let amPmHour = 1;
        if (hour !== "*" && inputHour.indexOf("/") !== 1) {
            if (inputAmPm === "pm") {
                amPmHour =
                    parseInt(inputHour, 10) < 12
                        ? parseInt(inputHour, 10) + 12
                        : parseInt(inputHour, 10);
            } else {
                amPmHour =
                    parseInt(inputHour, 10) < 12 ? parseInt(inputHour, 10) : 0;
            }
        }
        return amPmHour;
    };

    const convertToAmPm = (inputHour: string) => {
        let atHour = 1;
        let isAmPm = "am";
        if (inputHour !== "*") {
            if (parseInt(inputHour, 10) > 11) {
                atHour = parseInt(inputHour, 10);
                isAmPm = "pm";
                if (parseInt(inputHour, 10) > 12) {
                    atHour = parseInt(inputHour, 10) - 12;
                }
            } else {
                atHour = 12;
                isAmPm = "am";
                if (parseInt(inputHour, 10) > 0) {
                    atHour = parseInt(inputHour, 10);
                }
            }
        }
        return [atHour, isAmPm] as const;
    };

    useEffect(() => {
        // If modal is not shown but activeConfig is changed or if there is no focusedConfig then focus on activeConfig
        if (
            (!show || Object.keys(focusedConfig).length === 0) &&
            activeConfiguration
        ) {
            setFocusedConfig(activeConfiguration);
        } else {
            // Reset when there is a change to localConfigList, for example after deleting a config or after search
            setFocusedConfig(
                localConfigList.find((c) => c.uuid === focusedConfig.uuid) ??
                    ({} as Configuration)
            );
        }
    }, [show, scheduler, localConfigList, activeConfiguration]);

    useEffect(() => {
        const listResult =
            configuration &&
            configuration.filter(
                (config: Configuration) =>
                    config.name.includes(searchInput) &&
                    config.type === ConfigurationType.SCHEDULER
            );
        const unsavedConfig = localConfigList.find(
            (config) => config.name === ""
        );
        if (unsavedConfig) {
            listResult.push(unsavedConfig);
        }
        setLocalConfigList(listResult);
    }, [
        show,
        selectedScheduler,
        selectedSchedulerFolder,
        configuration,
        debouncedSearchInput,
    ]);

    const focusedConfigData = focusedConfig.data as SchedulerConfigurationData;

    useEffect(() => {
        const focusedMinute: string = focusedConfigData?.minute as string;
        const focusedHour: string = focusedConfigData?.hour as string;
        const focusedDayMonth: string = focusedConfigData?.dayMonth as string;
        const focusedMonth: string = focusedConfigData?.month as string;
        const focusedDayWeek: string = focusedConfigData?.dayWeek as string;

        const numDayMonth: number = +focusedDayMonth;
        const numMonth: number = +focusedMonth;
        setDefaultAllInput();

        if (focusedHour) {
            if (focusedHour.indexOf("/") !== -1 || focusedHour === "*") {
                // it's hourly 0 0/1 * * * &  0 * * * *
                if (
                    focusedDayMonth === "*" &&
                    focusedMonth === "*" &&
                    focusedDayWeek === "*"
                ) {
                    setHourlyEveryHour(focusedHour.split("/")[1]);
                    const amPMHour = focusedHour.split("/")[0];
                    const [atHour, isAmPm] = convertToAmPm(amPMHour);
                    setHourlyStartsAtAmPm(isAmPm);
                    setHourlyStartsAtHour(`${atHour}`);
                    setHourlyStartsAtMinute(focusedMinute);
                }
                setActiveTabeScheduler("hourly");
            } else if (
                focusedDayMonth === "*" &&
                focusedMonth === "*" &&
                focusedDayWeek === "*"
            ) {
                // it's daily 0 0 * * * everyday
                const [atHour, isAmPm] = convertToAmPm(focusedHour);
                setOptEveryday(true);
                setOptEveryWeekday(false);
                setOptEveryWeekend(false);
                setDailyStartsAtHour(`${atHour}`);
                setDailyStartsAtMinute(focusedMinute);
                setDailyStartsAtAmPm(isAmPm);
                setActiveTabeScheduler("daily");
            } else if (focusedDayWeek === "1-5") {
                // 0 0 * * 1-5 every weekday
                const [atHour, isAmPm] = convertToAmPm(focusedHour);
                setOptEveryday(false);
                setOptEveryWeekday(true);
                setOptEveryWeekend(false);
                setDailyStartsAtHour(`${atHour}`);
                setDailyStartsAtMinute(focusedMinute);
                setDailyStartsAtAmPm(isAmPm);
                setActiveTabeScheduler("daily");
            } else if (focusedDayWeek === "6,0") {
                // 0 0 * * 6,0 every weekend
                const [atHour, isAmPm] = convertToAmPm(focusedHour);
                setOptEveryday(false);
                setOptEveryWeekday(false);
                setOptEveryWeekend(true);
                setDailyStartsAtMinute(focusedMinute);
                setDailyStartsAtHour(`${atHour}`);
                setDailyStartsAtAmPm(isAmPm);
                setActiveTabeScheduler("daily");
            } else if (
                focusedDayWeek.indexOf(",") !== -1 &&
                focusedDayMonth === "*" &&
                focusedMonth === "*"
            ) {
                const checkedDays = focusedDayWeek.split(",");
                const newWeeklyDays = days;
                checkedDays.forEach((d) => {
                    const daysIndex = newWeeklyDays.findIndex(
                        (optWeekly) => optWeekly.day === d
                    );
                    newWeeklyDays[daysIndex].checked = true;
                });
                const [atHour, isAmPm] = convertToAmPm(focusedHour);
                setOptWeeklyDays(newWeeklyDays);
                setWeeklyStartsAtAmPm(isAmPm);
                setWeeklyStartsAtMinute(focusedMinute);
                setWeeklyStartsAtHour(`${atHour}`);
                setActiveTabeScheduler("weekly");
            } else if (
                focusedMonth.indexOf("/") !== -1 &&
                focusedDayWeek === "*"
            ) {
                const [atHour, isAmPm] = convertToAmPm(focusedHour);
                setOptMonthlyDay(true);
                setMonthlyEveryDay(focusedDayMonth);
                setMonthlyEveryMonth(focusedMonth.split("/")[1]);
                setMonthlyStartsAtMinute(focusedMinute);
                setMonthlyStartsAtAmPm(isAmPm);
                setMonthlyStartsAtHour(`${atHour}`);
                setActiveTabeScheduler("monthly");
            } else if (
                focusedDayMonth.indexOf("-") !== -1 &&
                focusedMonth.indexOf("/") !== -1 &&
                focusedDayWeek !== "*"
            ) {
                let weekNumber = "";
                if (focusedDayMonth === "1-7") {
                    weekNumber = "first";
                } else if (focusedDayMonth === "8-14") {
                    weekNumber = "second";
                } else if (focusedDayMonth === "15-21") {
                    weekNumber = "third";
                } else if (focusedDayMonth === "22-28") {
                    weekNumber = "fourth";
                }
                const [atHour, isAmPm] = convertToAmPm(focusedHour);
                setOptMonthlyWeek(true);
                setMonthlyQuarter(weekNumber);
                setMonthlyQuarterDay(focusedDayWeek);
                setMonthlyQuarterMonth(focusedMonth.split("/")[1]);
                setMonthlyStartsAtMinute(focusedMinute);
                setMonthlyStartsAtAmPm(isAmPm);
                setMonthlyStartsAtHour(`${atHour}`);
                setActiveTabeScheduler("monthly");
            } else if (
                focusedMinute === "0" &&
                focusedHour === "0" &&
                focusedDayWeek === "*" &&
                numDayMonth > 0 &&
                numMonth > 0
            ) {
                setOptYearlyMonth(true);
                setYearlyEveryDay(String(focusedDayMonth));
                setYearlyEveryMonth(String(focusedMonth));
                setActiveTabeScheduler("yearly");
            } else if (
                focusedMinute >= "0" &&
                focusedHour >= "0" &&
                focusedDayWeek === "*" &&
                numDayMonth > 0 &&
                numMonth > 0
            ) {
                const [atHour, isAmPm] = convertToAmPm(focusedHour);
                setOptYearlyMonth(true);
                setYearlyEveryDay(String(focusedDayMonth));
                setYearlyEveryMonth(String(focusedMonth));
                setYearlyStartsAtMinute(focusedMinute);
                setYearlyStartsAtAmPm(isAmPm);
                setYearlyStartsAtHour(`${atHour}`);
                setActiveTabeScheduler("yearly");
            } else if (
                focusedMinute === "0" &&
                focusedHour === "0" &&
                focusedDayWeek !== "*" &&
                focusedDayMonth.indexOf("-") !== -1 &&
                numMonth > 0
            ) {
                let weekNumber = "";
                if (focusedDayMonth === "1-7") {
                    weekNumber = "first";
                } else if (focusedDayMonth === "8-14") {
                    weekNumber = "second";
                } else if (focusedDayMonth === "15-21") {
                    weekNumber = "third";
                } else if (focusedDayMonth === "22-28") {
                    weekNumber = "fourth";
                }
                const [atHour, isAmPm] = convertToAmPm(focusedHour);
                setOptYearlyWeek(true);
                setYearlyQuarter(weekNumber);
                setYearlyQuarterDay(focusedDayWeek);
                setYearlyQuarterMonth(focusedMonth);
                setYearlyStartsAtAmPm(isAmPm);
                setYearlyStartsAtHour(`${atHour}`);
                setActiveTabeScheduler("yearly");
            } else if (
                // focusedMinute !== "0" &&
                focusedHour !== "0" &&
                focusedDayWeek !== "*" &&
                focusedDayMonth.indexOf("-") !== -1 &&
                numMonth > 0
            ) {
                let weekNumber = "";
                if (focusedDayMonth === "1-7") {
                    weekNumber = "first";
                } else if (focusedDayMonth === "8-14") {
                    weekNumber = "second";
                } else if (focusedDayMonth === "15-21") {
                    weekNumber = "third";
                } else if (focusedDayMonth === "22-28") {
                    weekNumber = "fourth";
                }
                const [atHour, isAmPm] = convertToAmPm(focusedHour);
                setOptYearlyWeek(true);
                setYearlyQuarter(weekNumber);
                setYearlyQuarterDay(focusedDayWeek);
                setYearlyQuarterMonth(focusedMonth);
                setYearlyStartsAtMinute(focusedMinute);
                setYearlyStartsAtAmPm(isAmPm);
                setYearlyStartsAtHour(`${atHour}`);
                setActiveTabeScheduler("yearly");
            }
            setCronFormat(
                focusedMinute,
                focusedHour,
                focusedDayMonth,
                focusedMonth,
                focusedDayWeek
            );
        }
    }, [focusedConfig.uuid]);

    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const createNewConfig = () => {
        const createdConfig = {
            uuid: generateUniqueId(CONFIGURATION_PREFIX),
            name: "",
        } as Configuration;
        setLocalConfigList([...localConfigList, createdConfig]);
        setActiveTabeScheduler("hourly");
        setFocusedConfig(createdConfig);
    };

    const handleTabsFormChange = (name: string, value: string) => {
        // check if hourly scheduller and everyhour option selected
        if (name === "everyhours") {
            setCronFormat(
                minute,
                `${hourlyStartsAtHour}/${value}`,
                "*",
                "*",
                "*"
            );
            setHourlyEveryHour(value);
        } else if (name === "startshours") {
            const amPmHour = convertAmPmTo24(value, hourlyStartsAtAmPm);
            setCronFormat(
                minute,
                `${amPmHour}/${hourlyEveryHour}`,
                "*",
                "*",
                "*"
            );
            setHourlyStartsAtHour(value);
        } else if (name === "startsminutes") {
            setCronFormat(`${value}`, hour, dayMonth, month, dayWeek);
            setHourlyStartsAtMinute(value);
        } else if (name === "hourlystartsampm") {
            const amPmHour = convertAmPmTo24(hourlyStartsAtHour, value);
            setCronFormat(
                minute,
                `${amPmHour}/${hourlyEveryHour}`,
                dayMonth,
                month,
                dayWeek
            );
            setHourlyStartsAtAmPm(`${value}`);
        } else if (name === "opteveryday") {
            // set everyday check radio on/off
            setOptEveryday(value === "true");
            // check if option everyday radio is on
            if (value === "true") {
                setCronFormat("0", "1", "*", month, "*");
            } else {
                // if everyhour unchecked set thoose to default values
                setCronFormat("*", "*", "*", month, dayWeek);
            }
            // set other daily radio off
            setOptEveryWeekday(false);
            setOptEveryWeekend(false);
            setDailyStartsAtHour("1");
            setDailyStartsAtMinute("0");
            setDailyStartsAtAmPm("am");
        } else if (name === "opteveryweekday") {
            // set every weekday check radio on/off
            setOptEveryWeekday(value === "true");
            // check if option every weekday radio is on
            if (value === "true") {
                setCronFormat("0", "1", "*", "*", "1-5");
            } else {
                // if every weekday unchecked set thoose to default values
                setDefaultCronFormat();
            }
            // set other daily radio off
            setOptEveryday(false);
            setOptEveryWeekend(false);
            setDailyStartsAtHour("1");
            setDailyStartsAtMinute("0");
            setDailyStartsAtAmPm("am");
        } else if (name === "opteveryweekend") {
            // set every weekend check radio on/off
            setOptEveryWeekend(value === "true");
            // check if option every weekend radio is on
            if (value === "true") {
                setCronFormat("0", "1", "*", "*", "6,0");
            } else {
                // if every weekend unchecked set thoose to default values
                setDefaultCronFormat();
            }
            setOptEveryday(false);
            setOptEveryWeekday(false);
            setDailyStartsAtHour("1");
            setDailyStartsAtMinute("0");
            setDailyStartsAtAmPm("am");
        } else if (name === "dailystartshour") {
            if (optEveryday || optEveryWeekday || optEveryWeekend) {
                const amPmHour = convertAmPmTo24(value, dailyStartsAtAmPm);
                setCronFormat(minute, `${amPmHour}`, dayMonth, month, dayWeek);
                setDailyStartsAtHour(value);
            }
        } else if (name === "dailystartsminute") {
            setCronFormat(value, hour, dayMonth, month, dayWeek);
            setDailyStartsAtMinute(value);
        } else if (name === "dailystartsampm") {
            const amPmHour = convertAmPmTo24(hour, value);
            setCronFormat(
                minute === "*" ? "0" : minute,
                `${amPmHour}`,
                dayMonth,
                month,
                dayWeek
            );
            setDailyStartsAtAmPm(value);
            // check the Weekly Days radio button
        } else if (name.indexOf("optweeklydays") !== -1) {
            // setstate add or remove value from radio
            const dayList: string[] = [...optDays];
            // push existing selected days
            optWeeklyDays.forEach((d) => {
                if (d.checked === true) {
                    if (dayList.indexOf(d.day) === -1) {
                        dayList.push(d.day);
                    }
                }
            });
            const indexList = dayList.indexOf(value);
            if (indexList !== -1) {
                dayList.splice(indexList, 1);
            } else {
                dayList.push(value);
            }
            dayList.sort();
            setOptDays(dayList);
            // update the days radio state, find by day number and update selected index
            const daysIndex = optWeeklyDays.findIndex(
                (optWeekly) => optWeekly.day === value
            );
            const updatedDays = {
                ...optWeeklyDays[daysIndex],
                checked: !optWeeklyDays[daysIndex].checked,
            };

            // setstate checked and unchacked radios
            const newWeeklyDays = [...optWeeklyDays];
            newWeeklyDays[daysIndex] = updatedDays;
            // setOptWeeklyDays(newWeeklyDays);
            // setCronFormat("0", "1", "*", "*", dayList.join());
            const amPmHour = convertAmPmTo24(hour, weeklyStartsAtAmPm);
            setOptWeeklyDays(newWeeklyDays);
            if (dayList.length > 0) {
                setCronFormat(minute, `${amPmHour}`, "*", "*", dayList.join());
            } else {
                setDefaultCronFormat();
                setDefaultHourly();
            }
        } else if (name === "weeklystartshours") {
            const amPmHour = convertAmPmTo24(value, weeklyStartsAtAmPm);
            setCronFormat(minute, `${amPmHour}`, dayMonth, month, dayWeek);
            setWeeklyStartsAtHour(value);
        } else if (name === "weeklystartsminute") {
            setCronFormat(value, hour, dayMonth, month, dayWeek);
            setWeeklyStartsAtMinute(value);
        } else if (name === "weeklystartsampm") {
            const amPmHour = convertAmPmTo24(hour, value);
            setCronFormat(minute, `${amPmHour}`, dayMonth, month, dayWeek);
            setWeeklyStartsAtAmPm(value);
        } else if (name === "optmonthlyday") {
            setDefaultMonthly();
            setOptMonthlyDay(value === "true");
            setOptMonthlyWeek(false);
            setMonthlyEveryDay("1");
            setMonthlyEveryMonth("1");
            if (value === "true") {
                setCronFormat("0", "1", "1", "*/1", "*");
            } else {
                setDefaultCronFormat();
                setDefaultMonthly();
            }
        } else if (name === "monthlyeveryday") {
            const amPmHour = convertAmPmTo24(hour, monthlyStartsAtAmPm);
            setOptMonthlyDay(true);
            setOptMonthlyWeek(false);
            let newMonth = month;
            if (month === "*" || month.indexOf("/") !== -1) {
                newMonth = "*/1";
                setMonthlyEveryMonth("1");
            }
            setCronFormat(minute, `${amPmHour}`, value, newMonth, "*");
            setMonthlyEveryDay(value);
        } else if (name === "monthlyeverymonth") {
            const amPmHour = convertAmPmTo24(hour, monthlyStartsAtAmPm);
            setOptMonthlyDay(true);
            setOptMonthlyWeek(false);
            setCronFormat(
                minute,
                `${amPmHour}`,
                dayMonth === "*" || dayMonth.indexOf("-") !== -1
                    ? "1"
                    : dayMonth,
                `*/${value}`,
                "*"
            );
            setMonthlyEveryMonth(value);
        } else if (name === "optmonthlyweek") {
            setDefaultMonthly();
            if (value === "true") {
                const firstWeekOfMonth = "1-7";
                setCronFormat("0", "1", firstWeekOfMonth, "*/1", "1");
                setMonthlyQuarterMonth("1");
            } else {
                setDefaultCronFormat();
                setDefaultHourly();
            }
            setOptMonthlyWeek(value === "true");
            setOptMonthlyDay(false);
        } else if (name === "monthlyquarter") {
            const amPmHour = convertAmPmTo24(hour, monthlyStartsAtAmPm);
            let newMonth = month;
            if (month === "*" || month.indexOf("/") !== -1) {
                newMonth = "*/1";
                setMonthlyQuarterMonth("1");
            }
            setOptMonthlyDay(false);
            setOptMonthlyWeek(true);
            let newDayMonth = dayMonth;
            if (value === "first") {
                newDayMonth = "1-7";
            } else if (value === "second") {
                newDayMonth = "8-14";
            } else if (value === "third") {
                newDayMonth = "15-21";
            } else if (value === "fourth") {
                newDayMonth = "22-28";
            }
            setCronFormat(
                minute,
                `${amPmHour}`,
                newDayMonth,
                newMonth,
                dayWeek
            );
            setMonthlyQuarter(value);
        } else if (name === "monthlyquarterday") {
            const amPmHour = convertAmPmTo24(hour, monthlyStartsAtAmPm);
            let newMonth = month;
            if (month === "*" || month.indexOf("/") !== -1) {
                newMonth = "*/1";
                setMonthlyQuarterMonth("1");
            }
            setOptMonthlyDay(false);
            setOptMonthlyWeek(true);
            setCronFormat(
                minute,
                `${amPmHour}`,
                dayMonth.indexOf("-") !== -1 ? dayMonth : "1-7",
                newMonth,
                value
            );
            setMonthlyQuarterDay(value);
        } else if (name === "monthlyquartermonth") {
            const amPmHour = convertAmPmTo24(hour, monthlyStartsAtAmPm);
            setOptMonthlyDay(false);
            setOptMonthlyWeek(true);
            setCronFormat(
                minute,
                `${amPmHour}`,
                dayMonth,
                `*/${value}`,
                dayWeek
            );
            setMonthlyQuarterMonth(value);
        } else if (name === "monthlystartsathour") {
            const amPmHour = convertAmPmTo24(value, monthlyStartsAtAmPm);
            if (hour.indexOf("/") !== -1) {
                setOptMonthlyDay(true);
                setCronFormat("0", `${amPmHour}`, "1", "*/1", "*");
            } else {
                setCronFormat(minute, `${amPmHour}`, dayMonth, month, dayWeek);
            }
            setMonthlyStartsAtHour(value);
        } else if (name === "monthlystartsatminute") {
            setCronFormat(value, hour, dayMonth, month, dayWeek);
            if (hour.indexOf("/") !== -1) {
                setOptMonthlyDay(true);
                setCronFormat(`${value}`, "1", "1", "*/1", "*");
            }
            setMonthlyStartsAtMinute(value);
        } else if (name === "monthlystartsatampm") {
            const amPmHour = convertAmPmTo24(hour, value);
            if (hour.indexOf("/") !== -1) {
                setOptMonthlyDay(true);
                setCronFormat("0", `${amPmHour}`, "1", "*/1", "*");
            } else {
                setCronFormat(minute, `${amPmHour}`, dayMonth, month, dayWeek);
            }
            setMonthlyStartsAtAmPm(value);
        } else if (name === "optyearlymonth") {
            setDefaultYearly();
            setOptYearlyMonth(value === "true");
            setOptYearlyWeek(false);
            if (value === "true") {
                setCronFormat("0", "1", "1", "1", "*");
            } else {
                setDefaultCronFormat();
            }
            setYearlyEveryMonth("1");
        } else if (name === "yearlyeveryday") {
            setDefaultYearly();
            setOptYearlyMonth(true);
            setOptYearlyWeek(false);
            setYearlyEveryDay(value);
            setYearlyEveryMonth(month);
            setCronFormat("0", "1", value, month === "*" ? "1" : month, "*");
        } else if (name === "yearlyeverymonth") {
            setDefaultYearly();
            setYearlyEveryDay(dayMonth);
            setOptYearlyMonth(true);
            setOptYearlyWeek(false);
            setYearlyEveryMonth(value);
            setCronFormat(
                "0",
                "1",
                dayMonth === "*" || dayMonth.indexOf("-") !== -1
                    ? "1"
                    : dayMonth,
                value,
                "*"
            );
        } else if (name === "optyearlyweek") {
            setDefaultYearly();
            setOptYearlyWeek(value === "true");
            setOptYearlyMonth(false);
            if (value === "true") {
                setCronFormat("0", "1", "1-7", "1", "1");
            } else {
                setDefaultCronFormat();
                setDefaultYearly();
            }
            setYearlyStartsAtHour("1");
            setYearlyStartsAtMinute("0");
            setYearlyStartsAtAmPm("am");
        } else if (name === "yearlyquarter") {
            setOptYearlyMonth(false);
            setOptYearlyWeek(true);
            let newDayMonth = dayMonth;
            if (value === "first") {
                newDayMonth = "1-7";
            } else if (value === "second") {
                newDayMonth = "8-14";
            } else if (value === "third") {
                newDayMonth = "15-21";
            } else if (value === "fourth") {
                newDayMonth = "22-28";
            }
            setCronFormat(
                minute,
                hour === "*" || hour.indexOf("/") !== -1 ? "1" : hour,
                newDayMonth,
                month === "*" ? "1" : month,
                dayWeek === "*" ? "1" : dayWeek
            );
            setYearlyQuarter(value);
        } else if (name === "yearlyquarterday") {
            setOptYearlyMonth(false);
            setOptYearlyWeek(true);
            setCronFormat(
                minute,
                hour === "*" || hour.indexOf("/") !== -1 ? "1" : hour,
                dayMonth.indexOf("-") !== -1 ? dayMonth : "1-7",
                month === "*" ? "1" : month,
                value
            );
            setYearlyQuarterDay(value);
        } else if (name === "yearlyquartermonth") {
            setOptYearlyMonth(false);
            setOptYearlyWeek(true);
            setCronFormat(
                minute,
                hour === "*" || hour.indexOf("/") !== -1 ? "1" : hour,
                dayMonth.indexOf("-") !== -1 ? dayMonth : "1-7",
                value,
                dayWeek === "*" ? "1" : dayWeek
            );
            setYearlyQuarterMonth(value);
        } else if (name === "yearlystartsathour") {
            const amPmHour = convertAmPmTo24(value, yearlyStartsAtAmPm);
            if (hour.indexOf("/") !== -1) {
                setOptYearlyMonth(true);
                setCronFormat("0", `${amPmHour}`, "1", "1", "*");
            } else {
                setCronFormat(minute, `${amPmHour}`, dayMonth, month, dayWeek);
            }
            setYearlyStartsAtHour(value);
        } else if (name === "yearlystartsatminute") {
            setCronFormat(value, hour, dayMonth, month, dayWeek);
            if (hour.indexOf("/") !== -1) {
                setOptYearlyMonth(true);
                setCronFormat(`${value}`, "1", "1", "1", "*");
            }
            setYearlyStartsAtMinute(value);
        } else if (name === "yearlystartsatampm") {
            const amPmHour = convertAmPmTo24(hour, value);
            if (hour.indexOf("/") !== -1) {
                setOptYearlyMonth(true);
                setCronFormat("0", `${amPmHour}`, "1", "1", "*");
            } else {
                setCronFormat(minute, `${amPmHour}`, dayMonth, month, dayWeek);
            }
            setYearlyStartsAtAmPm(value);
        }
    };

    const deleteConfig = () => {
        // Update localConfigList here to remove newly created config that is not yet saved, and also to support unit testing
        setLocalConfigList(
            localConfigList.filter(
                (config) => config.uuid !== focusedConfig.uuid
            )
        );
        deleteConfiguration(focusedConfig.uuid);

        toastMessage(
            t(`scheduler.dashboard.modalConfig.form.success.delete`),
            toast.TYPE.SUCCESS
        );
    };

    const deleteConfigPopover = () => {
        if (selectedSchedulerFolderUuid) {
            if (
                focusedConfig.uuid ===
                selectedSchedulerFolder?.configuration_uuid
            ) {
                setIsUsed("used");
                setIsFolder("Folder");
            } else {
                const configIndex = scheduler.findIndex(
                    (conf) => conf.configuration_uuid === focusedConfig.uuid
                );
                if (configIndex >= 0) {
                    setIsUsed("used");
                    setIsFolder("Scheduler");
                } else {
                    setIsUsed("delete");
                }
            }
        } else if (
            focusedConfig.uuid === selectedScheduler?.configuration_uuid
        ) {
            setIsUsed("used");
            setIsFolder("Scheduler");
        } else {
            const configIndex = folder.findIndex(
                (conf) => conf.configuration_uuid === focusedConfig.uuid
            );
            if (configIndex >= 0) {
                setIsUsed("used");
                setIsFolder("Folder");
            } else {
                setIsUsed("delete");
            }
        }
    };

    // Configuration for edit form
    const editConfigurationForm = useFormik<EditConfigurationForm>({
        enableReinitialize: true,

        initialValues: {
            uuid: focusedConfig?.uuid,
            name: focusedConfig?.name || "",
        },

        onSubmit: (values, formikHelpers) => {
            const { resetForm } = formikHelpers;

            const newConfig: Configuration = {
                ...focusedConfig,
                name: values.name,
                data: {
                    minute,
                    hour,
                    dayMonth,
                    month,
                    dayWeek,
                } as SchedulerConfigurationData,
                type: ConfigurationType.SCHEDULER,
            };

            // check if config already exists
            const exists = configuration.filter(
                (config) => config.uuid === focusedConfig.uuid
            );

            // if it doesn't exist yet = newly created config
            if (exists.length === 0) {
                newConfig.uuid = generateUniqueId("config");
                addNewConfiguration(newConfig);
            } else {
                updateConfiguration(newConfig);
            }

            setLocalConfigList([]);
            setDefaultAllInput();

            // Show a success message
            toastMessage(
                t(`scheduler.dashboard.modalConfig.form.success.update`),
                toast.TYPE.SUCCESS
            );
            // set inputs with default values
            setDefaultAllInput();
            // close modal if success
            handleClose();
            // reset form
            resetForm();
        },

        validate: async (values) => {
            try {
                // Form validation schema
                const validationSchema = Yup.object({
                    name: Yup.string()
                        .required(
                            "scheduler.dashboard.modalConfig.form.error.required.name"
                        )
                        .test({
                            message: "common.error.nameExist",
                            test: (value) => {
                                // Find config with the same name within Scheduler configuration list
                                const items = configuration.find((item) => {
                                    return (
                                        item.type ===
                                            ConfigurationType.SCHEDULER &&
                                        item.name === value &&
                                        item.uuid !== focusedConfig.uuid
                                    );
                                });

                                // Check if value (name) is in the list
                                return items === undefined;
                            },
                        })
                        .matches(
                            SPECIAL_CHARACTERS_REGEX,
                            "common.error.specialCharactersDetected"
                        ),
                });

                // Trigger form validation
                await validateYupSchema(values, validationSchema, true);

                // Return an empty object if there's no validation error
                return {};
            } catch (error) {
                const validationError = error as ValidationError;

                // get only first error
                const errorMessage = t(validationError.errors[0]);

                // Show error
                toastMessage(errorMessage, toast.TYPE.ERROR);

                // Return validation error
                return yupToFormErrors(validationError);
            }
        },

        validateOnChange: false,
        validateOnBlur: false,
    });

    // modal close handler
    const onCloseModal = () => {
        // set all input to default values
        setDefaultAllInput();
        // close modal
        handleClose();

        // reset
        setFocusedConfig({} as Configuration);
        setLocalConfigList([]);
        setSearchInput("");

        // clear fields once modal is closed
        editConfigurationForm.resetForm();
    };

    return (
        <EmobiqModal
            show={show}
            size={EmobiqModalSize.lg}
            handleClose={onCloseModal}
            modalHeaderTitle={t("scheduler.dashboard.modalConfig.title")}
        >
            <Row className="m-n4 h-525">
                {/* Left Component */}
                <Col xs={2} className="pt-3 pb-4 pe-0 d-flex flex-column w-180">
                    {/* Search Bar */}
                    <InputGroup className="pb-3 pe-2">
                        <Form.Control
                            type="text"
                            placeholder={t(
                                `scheduler.dashboard.modalConfig.form.placeholder.search`
                            )}
                            className="text-rg border-end-0 rounded-6 input-placeholder-chinese-silver"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                        <InputGroup.Text className="text-chinese-silver bg-white ps-0 rounded-6">
                            <FontAwesomeIcon icon={faSearch} />
                        </InputGroup.Text>
                    </InputGroup>

                    {/* Scheduler Configuration List */}
                    <div className="pb-3 pe-0 overflow-auto mh-370">
                        {localConfigList.map((config) => (
                            <Button
                                key={config.uuid}
                                aria-label={
                                    config.name !== ""
                                        ? config.name
                                        : t(
                                              `scheduler.dashboard.modalConfig.form.placeholder.new`
                                          )
                                }
                                variant={
                                    ButtonVariant.PHILIPPINE_GRAY_EMOBIQ_BRAND
                                }
                                className="border-0 border-top rounded-0 text-rg w-100 text-start btn-config pt-2 pb-2"
                                active={focusedConfig.uuid === config.uuid}
                                onClick={() => {
                                    setFocusedConfig(config);
                                }}
                            >
                                <Stack
                                    direction="vertical"
                                    className="d-md-flex d-inline"
                                >
                                    <div className="text-truncate text-rg">
                                        {config.name !== ""
                                            ? config.name
                                            : t(
                                                  `scheduler.dashboard.modalConfig.form.placeholder.new`
                                              )}
                                    </div>
                                    {config.uuid ===
                                        selectedScheduler?.configuration_uuid ||
                                    config.uuid ===
                                        selectedSchedulerFolder?.configuration_uuid ? (
                                        <div className="text-truncate text-xxs">
                                            {t(
                                                "scheduler.dashboard.modalConfig.selectedLabel"
                                            )}
                                        </div>
                                    ) : (
                                        <div />
                                    )}
                                </Stack>
                            </Button>
                        ))}
                    </div>

                    {/* Action Button - Create */}
                    <div className="mt-auto ms-12 pt-3">
                        <Button
                            style={
                                currentUnsavedConfig
                                    ? { visibility: "hidden" }
                                    : {}
                            } // hide button if there is unsaved config
                            className="px-3 px-md-4 py-2 rounded-3-px text-sm"
                            variant={ButtonVariant.OUTLINE_EMOBIQ_BRAND}
                            onClick={() => createNewConfig()}
                            key="Create"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            <span className="ms-1">
                                {t(
                                    "scheduler.dashboard.modalConfig.form.button.create"
                                )}
                            </span>
                        </Button>
                    </div>
                </Col>
                <Col xs={10} className="border-start pb-4 w-620">
                    <Container className="text-sm h-100 d-flex flex-column">
                        {/* Add / Update Scheduler Configuration Form */}
                        {Object.keys(focusedConfig).length > 0 && (
                            <>
                                <Form
                                    onSubmit={
                                        editConfigurationForm.handleSubmit
                                    }
                                    id="schedulers-edit-configuration-form"
                                >
                                    <Form.Group
                                        key="name"
                                        controlId="name"
                                        className="row my-3 align-items-center"
                                    >
                                        <Col xs={12} sm={1} className="pe-0">
                                            <Form.Label className="m-0 text-philippine-gray">
                                                {t(
                                                    `scheduler.dashboard.modalConfig.form.input.name`
                                                )}
                                            </Form.Label>
                                        </Col>
                                        <Col xs={12} sm={5}>
                                            <Form.Control
                                                name="name"
                                                type="text"
                                                className="rounded-3-px text-sm"
                                                placeholder={t(
                                                    `scheduler.dashboard.modalConfig.form.placeholder.name`
                                                )}
                                                value={
                                                    editConfigurationForm.values
                                                        .name
                                                }
                                                onChange={(e) => {
                                                    editConfigurationForm.handleChange(
                                                        e
                                                    );
                                                }}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Form>
                                <Row className="pt-2 mt-auto">
                                    <Form.Group
                                        key="menu"
                                        controlId="menu"
                                        className="row my-3 align-items-center form"
                                    >
                                        <Col
                                            xs={12}
                                            sm={12}
                                            className="pe-0"
                                            id="edit-configuration-menu"
                                        >
                                            <EditConfigurationMenu
                                                handleChange={
                                                    handleTabsFormChange
                                                }
                                                hourlyEveryHour={
                                                    hourlyEveryHour
                                                }
                                                hourlyStartsAtHour={
                                                    hourlyStartsAtHour
                                                }
                                                hourlyStartsAtMinute={
                                                    hourlyStartsAtMinute
                                                }
                                                hourlyStartsAtAmPm={
                                                    hourlyStartsAtAmPm
                                                }
                                                optEveryday={optEveryday}
                                                optEveryWeekday={
                                                    optEveryWeekday
                                                }
                                                optEveryWeekend={
                                                    optEveryWeekend
                                                }
                                                dailyStartsAtHour={
                                                    dailyStartsAtHour
                                                }
                                                dailyStartsAtMinute={
                                                    dailyStartsAtMinute
                                                }
                                                dailyStartsAtAmPm={
                                                    dailyStartsAtAmPm
                                                }
                                                optWeeklyDays={optWeeklyDays}
                                                weeklyStartsAtHour={
                                                    weeklyStartsAtHour
                                                }
                                                weeklyStartsAtMinute={
                                                    weeklyStartsAtMinute
                                                }
                                                weeklyStartsAtAmPm={
                                                    weeklyStartsAtAmPm
                                                }
                                                optMonthlyDay={optMonthlyDay}
                                                optMonthlyWeek={optMonthlyWeek}
                                                monthlyStartsAtHour={
                                                    monthlyStartsAtHour
                                                }
                                                monthlyStartsAtMinute={
                                                    monthlyStartsAtMinute
                                                }
                                                monthlyStartsAtAmPm={
                                                    monthlyStartsAtAmPm
                                                }
                                                monthlyEveryDay={
                                                    monthlyEveryDay
                                                }
                                                monthlyEveryMonth={
                                                    monthlyEveryMonth
                                                }
                                                monthlyQuarter={monthlyQuarter}
                                                monthlyQuarterDay={
                                                    monthlyQuarterDay
                                                }
                                                monthlyQuarterMonth={
                                                    monthlyQuarterMonth
                                                }
                                                optYearlyMonth={optYearlyMonth}
                                                optYearlyWeek={optYearlyWeek}
                                                yearlyEveryDay={yearlyEveryDay}
                                                yearlyEveryMonth={
                                                    yearlyEveryMonth
                                                }
                                                yearlyQuarter={yearlyQuarter}
                                                yearlyQuarterDay={
                                                    yearlyQuarterDay
                                                }
                                                yearlyQuarterMonth={
                                                    yearlyQuarterMonth
                                                }
                                                yearlyStartsAtHour={
                                                    yearlyStartsAtHour
                                                }
                                                yearlyStartsAtMinute={
                                                    yearlyStartsAtMinute
                                                }
                                                yearlyStartsAtAmPm={
                                                    yearlyStartsAtAmPm
                                                }
                                                activeTabeScheduler={
                                                    activeTabeScheduler
                                                }
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </>
                        )}
                        {/* Action Buttons - Delete, Update, Select */}
                        <Row className="pt-2 mt-auto">
                            <Col className="text-end">
                                {Object.keys(focusedConfig).length > 0 && (
                                    <>
                                        <EditConfigurationDeletePopover
                                            isUsed={isUsed}
                                            isFolder={isFolder}
                                            deleteConfig={deleteConfig}
                                            deleteConfigPopover={
                                                deleteConfigPopover
                                            }
                                        />

                                        <Button
                                            className="px-3 px-md-4 py-2 ms-3 rounded-3-px text-sm"
                                            type="submit"
                                            form="schedulers-edit-configuration-form"
                                            variant={
                                                ButtonVariant.OUTLINE_EMOBIQ_BRAND
                                            }
                                        >
                                            {t(
                                                "scheduler.dashboard.modalConfig.form.button.update"
                                            )}
                                        </Button>
                                        {focusedConfig.name !== "" && (
                                            <Button
                                                className="px-3 px-md-4 py-2 ms-3 rounded-3-px mt-3 mt-md-0 text-sm"
                                                variant={
                                                    ButtonVariant.OUTLINE_EMOBIQ_BRAND
                                                }
                                                onClick={() =>
                                                    setSelectedConfiguration(
                                                        focusedConfig.uuid
                                                    )
                                                }
                                            >
                                                {focusedConfig.uuid ===
                                                    selectedScheduler?.configuration_uuid ||
                                                focusedConfig.uuid ===
                                                    selectedSchedulerFolder?.configuration_uuid ? (
                                                    <>
                                                        <FontAwesomeIcon
                                                            icon={faCheck}
                                                        />
                                                        <span className="ms-1">
                                                            {t(
                                                                "scheduler.dashboard.modalConfig.selectedLabel"
                                                            )}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="ms-1">
                                                        {t(
                                                            "scheduler.dashboard.modalConfig.form.button.select"
                                                        )}
                                                    </span>
                                                )}
                                            </Button>
                                        )}
                                    </>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </EmobiqModal>
    );
};

export type { EditConfigurationForm };
export default EditConfiguration;
