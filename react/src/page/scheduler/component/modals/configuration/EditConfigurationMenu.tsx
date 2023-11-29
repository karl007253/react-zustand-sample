import { useEffect, useState } from "react";
import TabMenu, { TabItem } from "../../../../../common/component/TabMenu";
import EditConfigurationMenuHourly from "./EditConfigurationMenuHourly";
import EditConfigurationMenuDaily from "./EditConfigurationMenuDaily";
import EditConfigurationMenuWeekly from "./EditConfigurationMenuWeekly";
import EditConfigurationMenuMonthly from "./EditConfigurationMenuMonthly";
import EditConfigurationMenuYearly from "./EditConfigurationMenuYearly";

interface DaysWeek {
    day: string;
    name: string;
    checked: boolean;
}

type ConfigurationMenuInputProps = {
    handleChange: (name: string, value: string) => void;
    hourlyEveryHour: string;
    hourlyStartsAtHour: string;
    hourlyStartsAtMinute: string;
    hourlyStartsAtAmPm: string;
    optEveryday: boolean;
    optEveryWeekday: boolean;
    optEveryWeekend: boolean;
    dailyStartsAtHour: string;
    dailyStartsAtMinute: string;
    dailyStartsAtAmPm: string;
    optWeeklyDays: DaysWeek[];
    weeklyStartsAtHour: string;
    weeklyStartsAtMinute: string;
    weeklyStartsAtAmPm: string;
    optMonthlyDay: boolean;
    optMonthlyWeek: boolean;
    monthlyStartsAtHour: string;
    monthlyStartsAtMinute: string;
    monthlyStartsAtAmPm: string;
    monthlyEveryDay: string;
    monthlyEveryMonth: string;
    monthlyQuarter: string;
    monthlyQuarterDay: string;
    monthlyQuarterMonth: string;
    optYearlyMonth: boolean;
    optYearlyWeek: boolean;
    yearlyStartsAtHour: string;
    yearlyStartsAtMinute: string;
    yearlyStartsAtAmPm: string;
    yearlyEveryDay: string;
    yearlyEveryMonth: string;
    yearlyQuarter: string;
    yearlyQuarterDay: string;
    yearlyQuarterMonth: string;
    activeTabeScheduler: string;
};

const EditConfigurationMenu = ({
    handleChange,
    hourlyEveryHour,
    hourlyStartsAtHour,
    hourlyStartsAtMinute,
    hourlyStartsAtAmPm,
    optEveryday,
    optEveryWeekday,
    optEveryWeekend,
    dailyStartsAtHour,
    dailyStartsAtMinute,
    dailyStartsAtAmPm,
    optWeeklyDays,
    weeklyStartsAtHour,
    weeklyStartsAtMinute,
    weeklyStartsAtAmPm,
    optMonthlyDay,
    optMonthlyWeek,
    monthlyStartsAtHour,
    monthlyStartsAtMinute,
    monthlyStartsAtAmPm,
    monthlyEveryDay,
    monthlyEveryMonth,
    monthlyQuarter,
    monthlyQuarterDay,
    monthlyQuarterMonth,
    optYearlyMonth,
    optYearlyWeek,
    yearlyStartsAtHour,
    yearlyStartsAtMinute,
    yearlyStartsAtAmPm,
    yearlyEveryDay,
    yearlyEveryMonth,
    yearlyQuarter,
    yearlyQuarterDay,
    yearlyQuarterMonth,
    activeTabeScheduler,
}: ConfigurationMenuInputProps) => {
    const [primaryActiveTab, setPrimaryActiveTab] = useState("");

    const [secondaryActiveTab, setSecondaryActiveTab] = useState("");

    const primaryTabs: TabItem[] = [
        {
            title: "scheduler.dashboard.modalConfig.tabs.primary.schedule",
        },
    ];

    const secondaryTabs: TabItem[] = [
        {
            title: "scheduler.dashboard.modalConfig.tabs.secondary.hourly",
            component: (
                <EditConfigurationMenuHourly
                    handleChange={handleChange}
                    hourlyEveryHour={hourlyEveryHour}
                    hourlyStartsAtHour={hourlyStartsAtHour}
                    hourlyStartsAtMinute={hourlyStartsAtMinute}
                    hourlyStartsAtAmPm={hourlyStartsAtAmPm}
                />
            ),
        },
        {
            title: "scheduler.dashboard.modalConfig.tabs.secondary.daily",
            component: (
                <EditConfigurationMenuDaily
                    handleChange={handleChange}
                    optEveryday={optEveryday}
                    optEveryWeekday={optEveryWeekday}
                    optEveryWeekend={optEveryWeekend}
                    dailyStartsAtHour={dailyStartsAtHour}
                    dailyStartsAtMinute={dailyStartsAtMinute}
                    dailyStartsAtAmPm={dailyStartsAtAmPm}
                />
            ),
        },
        {
            title: "scheduler.dashboard.modalConfig.tabs.secondary.weekly",
            component: (
                <EditConfigurationMenuWeekly
                    handleChange={handleChange}
                    optWeeklyDays={optWeeklyDays}
                    weeklyStartsAtHour={weeklyStartsAtHour}
                    weeklyStartsAtMinute={weeklyStartsAtMinute}
                    weeklyStartsAtAmPm={weeklyStartsAtAmPm}
                />
            ),
        },
        {
            title: "scheduler.dashboard.modalConfig.tabs.secondary.monthly",
            component: (
                <EditConfigurationMenuMonthly
                    handleChange={handleChange}
                    optMonthlyDay={optMonthlyDay}
                    optMonthlyWeek={optMonthlyWeek}
                    monthlyStartsAtHour={monthlyStartsAtHour}
                    monthlyStartsAtMinute={monthlyStartsAtMinute}
                    monthlyStartsAtAmPm={monthlyStartsAtAmPm}
                    monthlyEveryDay={monthlyEveryDay}
                    monthlyEveryMonth={monthlyEveryMonth}
                    monthlyQuarter={monthlyQuarter}
                    monthlyQuarterDay={monthlyQuarterDay}
                    monthlyQuarterMonth={monthlyQuarterMonth}
                />
            ),
        },
        {
            title: "scheduler.dashboard.modalConfig.tabs.secondary.yearly",
            component: (
                <EditConfigurationMenuYearly
                    handleChange={handleChange}
                    optYearlyMonth={optYearlyMonth}
                    optYearlyWeek={optYearlyWeek}
                    yearlyStartsAtHour={yearlyStartsAtHour}
                    yearlyStartsAtMinute={yearlyStartsAtMinute}
                    yearlyStartsAtAmPm={yearlyStartsAtAmPm}
                    yearlyEveryDay={yearlyEveryDay}
                    yearlyEveryMonth={yearlyEveryMonth}
                    yearlyQuarter={yearlyQuarter}
                    yearlyQuarterDay={yearlyQuarterDay}
                    yearlyQuarterMonth={yearlyQuarterMonth}
                />
            ),
        },
    ];

    useEffect(() => {
        setSecondaryActiveTab(
            `scheduler.dashboard.modalConfig.tabs.secondary.${activeTabeScheduler}`
        );
    }, [activeTabeScheduler]);

    return (
        <TabMenu
            primary={{
                tabs: primaryTabs,
                activeTab: primaryActiveTab,
                onTabChange: setPrimaryActiveTab,
            }}
            secondary={{
                tabs: secondaryTabs,
                activeTab: secondaryActiveTab,
                onTabChange: setSecondaryActiveTab,
                className: "scheduler-tab-content",
            }}
        />
    );
};

export default EditConfigurationMenu;
