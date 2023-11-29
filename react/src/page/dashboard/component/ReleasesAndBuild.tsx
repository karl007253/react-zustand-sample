import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import _ from "lodash";
import { AuditReleaseAndBuild } from "../../../common/zustand/interface/AuditInterface";

import useStore from "../../../common/zustand/Store";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Chart options
export const options = {
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "top" as const,
            labels: {
                padding: 70,
                boxWidth: 58,
                boxHeight: 8,
                font: {
                    size: 14,
                },
            },
            display: true,
            fullSize: true,
        },
    },
    layout: {
        padding: {
            top: -50,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

// Configure how many backtrack months are visible in the graph
const MONTHS_TO_DISPLAY = 12;

const allAuditTags = ["debug", "development", "release"] as const;

type AuditTag = (typeof allAuditTags)[number];

const graphLineColor: { [key in AuditTag]: string } = {
    debug: "#CE8828",
    development: "#5784FF",
    release: "#4EBA6B",
};

// Short month name used for x-axis labels for the chart
// Sample output: ["JAN", "FEB", "MAR", ..., "DEC"]
const MONTH_NAMES = _.range(0, 12).map((month) => {
    return new Date(Date.UTC(2000, month))
        .toLocaleString("default", { month: "short" })
        .toUpperCase();
});

// Calculate how many months of difference between two dates
const calculateMonthDiff = (
    yearFrom: number,
    monthFrom: number,
    yearTo: number,
    monthTo: number
): number => {
    const yearDiff = yearTo - yearFrom;
    const monthDiff = monthTo - monthFrom;
    return yearDiff * 12 + monthDiff;
};

// Real modulus operation that supports negative values
const realMod = (n: number, m: number): number => {
    return ((n % m) + m) % m;
};

const ReleasesAndBuild = () => {
    const { t } = useTranslation();

    // Initialize releasesAndBuildBased with build-type as key and array of number of built times per month
    const releasesAndBuildBasedOnTags = Object.fromEntries(
        allAuditTags.map((tag) => {
            // Data will contain [0, 0, 0, 0, ..., 0] for each tag
            return [tag, Array(MONTHS_TO_DISPLAY).fill(0)];
        })
    ) as { [key in AuditTag]: number[] };

    const { releasesAndBuild } = useStore((state) => ({
        releasesAndBuild: state.releasesAndBuild,
    }));

    // Get current time
    const now = new Date();

    // Create x-axis labels from short month name, starting at (n+1)th month last year and ends at current month this year
    const labels = _.range(
        now.getMonth() - MONTHS_TO_DISPLAY,
        now.getMonth()
    ).map((month) => MONTH_NAMES[realMod(month + 1, 12)]);

    // Loop through the relevant state and update the array of number of built times per month
    releasesAndBuild.forEach((release: AuditReleaseAndBuild) => {
        const monthDiff = calculateMonthDiff(
            release.year,
            // Month in backend (Golang) are 1-based while JS is 0-based. Therefore, subtract month by 1
            release.month - 1,
            now.getFullYear(),
            now.getMonth()
        );

        if (monthDiff < 0 || monthDiff >= MONTHS_TO_DISPLAY) {
            // Month difference are outside of graph bounds
            return;
        }

        // IF MONTHS_TO_DISPLAY is 12, the first (left-most) plot point will be the data with monthDiff = 11,
        // 2nd point monthDiff = 10 so on until the last point which will have monthDiff = 0 (current month and year)
        releasesAndBuildBasedOnTags[release.tags as AuditTag][
            MONTHS_TO_DISPLAY - monthDiff - 1
        ] = release.count;
    });

    // data for the chart
    const data = {
        labels,
        datasets: allAuditTags.map((tag) => {
            return {
                label: tag.toUpperCase(),
                data: releasesAndBuildBasedOnTags[tag],
                borderColor: graphLineColor[tag],
                backgroundColor: graphLineColor[tag],
            };
        }),
    };

    return (
        <>
            <Row>
                <Col
                    sm={12}
                    className="dashboard-card-title text-xxxl text-uppercase mb-3"
                >
                    <h4 className="text-center">
                        {t("dashboard.title.releaseAndBuild")}
                    </h4>
                </Col>
            </Row>
            <Row className="mb-5 chart-container">
                {/* This is where the chart of releases and build will be rendered */}
                <Line
                    options={options}
                    data={data}
                    aria-label="releases-and-build-graph"
                />
            </Row>
        </>
    );
};

export default ReleasesAndBuild;
