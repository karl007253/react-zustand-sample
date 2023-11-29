import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

type ConfigurationMenuYearlyInputProps = {
    handleChange: (name: string, value: string) => void;
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
};

const EditConfigurationMenuYearly = ({
    handleChange,
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
}: ConfigurationMenuYearlyInputProps) => {
    const { t } = useTranslation();

    const hours = Array.from(Array(13).keys()).slice(1);
    const minutes = Array.from(Array(60).keys());
    // const daysNumber = Array.from(Array(8).keys()).slice(1);
    // const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const days = [
        { day: "1", name: "mon" },
        { day: "2", name: "tue" },
        { day: "3", name: "wed" },
        { day: "4", name: "thu" },
        { day: "5", name: "fri" },
        { day: "6", name: "sat" },
        { day: "0", name: "sun" },
    ];
    const day = Array.from(Array(32).keys()).slice(1);
    const monthsNumber = Array.from(Array(13).keys()).slice(1);
    const months = [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
    ];
    const quarter = ["first", "second", "third", "fourth"];

    // to set set the radio buttons check and uncheck by onclick
    const setOpt = (name: string, value: string) => {
        // condition to send event when radio buttons unchecked
        if (value === "false") {
            handleChange(name, value);
        }
    };

    return (
        <>
            <Row>
                <Col
                    xs={12}
                    sm={2}
                    className="d-flex align-items-center pt-2 text-philippine-gray"
                >
                    <Form.Check
                        type="radio"
                        id="yearly-hour"
                        aria-label="optyearlymonth"
                        name="optyearlymonth"
                        label={t(
                            `scheduler.dashboard.modalConfig.form.label.day`
                        )}
                        onChange={(e) =>
                            handleChange(
                                e.target.name,
                                String(e.target.checked)
                            )
                        }
                        onClick={() =>
                            setOpt("optyearlymonth", String(!optYearlyMonth))
                        }
                        checked={optYearlyMonth}
                    />
                </Col>
                <Col xs={12} sm={2} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="yearlyeveryday"
                        value={yearlyEveryDay}
                        name="yearlyeveryday"
                        onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                        }
                    >
                        {day.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={12} sm={1} className="d-flex align-items-center pt-2">
                    <Form.Label className="d-flex align-items-center text-philippine-gray px-6">
                        {t(`scheduler.dashboard.modalConfig.form.label.of`)}
                    </Form.Label>
                </Col>
                <Col xs={12} sm={3} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="yearlyeverymonth"
                        value={yearlyEveryMonth}
                        name="yearlyeverymonth"
                        onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                        }
                    >
                        {monthsNumber.map((m) => (
                            <option key={m} value={String(m)}>
                                {t(
                                    `scheduler.dashboard.modalConfig.form.select.options.${
                                        months[m - 1]
                                    }`
                                )}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                <Col
                    xs={12}
                    sm={2}
                    className="d-flex align-items-center pt-2 text-philippine-gray"
                >
                    <Form.Check
                        type="radio"
                        id="optyearlyweek"
                        aria-label="optyearlyweek"
                        name="optyearlyweek"
                        label={t(
                            `scheduler.dashboard.modalConfig.form.label.the`
                        )}
                        onChange={(e) =>
                            handleChange(
                                e.target.name,
                                String(e.target.checked)
                            )
                        }
                        onClick={() =>
                            setOpt("optyearlyweek", String(!optYearlyWeek))
                        }
                        checked={optYearlyWeek}
                    />
                </Col>
                <Col xs={12} sm={3} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="yearlyquarter"
                        value={yearlyQuarter}
                        name="yearlyquarter"
                        onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                        }
                    >
                        {quarter.map((q) => (
                            <option key={q} value={q}>
                                {t(
                                    `scheduler.dashboard.modalConfig.form.select.options.${q}`
                                )}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={12} sm={3} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="yearlyquarterday"
                        value={yearlyQuarterDay}
                        name="yearlyquarterday"
                        onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                        }
                    >
                        {days.map((d) => (
                            <option key={d.day} value={d.day}>
                                {t(
                                    `scheduler.dashboard.modalConfig.form.label.${d.name}`
                                )}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={12} sm={1} className="d-flex align-items-center pt-2">
                    <Form.Label className="d-flex align-items-center text-philippine-gray px-6">
                        {t(`scheduler.dashboard.modalConfig.form.label.of`)}
                    </Form.Label>
                </Col>
                <Col xs={12} sm={3} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="yearlyquartermonth"
                        value={yearlyQuarterMonth}
                        name="yearlyquartermonth"
                        onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                        }
                    >
                        {monthsNumber.map((a) => (
                            <option key={a} value={String(a)}>
                                {t(
                                    `scheduler.dashboard.modalConfig.form.select.options.${
                                        months[a - 1]
                                    }`
                                )}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={2} className="d-flex align-items-center pt-2">
                    <Form.Label className="text-philippine-gray">
                        {t(
                            `scheduler.dashboard.modalConfig.form.label.startsat`
                        )}
                    </Form.Label>
                </Col>
                <Col xs={12} sm={3} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="yearlystartsathour"
                        value={yearlyStartsAtHour}
                        name="yearlystartsathour"
                        onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                        }
                    >
                        {hours.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={12} sm={1} className="d-flex align-items-center pt-2">
                    <Form.Label className="d-flex align-items-center text-philippine-gray px-12">
                        :
                    </Form.Label>
                </Col>
                <Col xs={12} sm={3} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="yearlystartsatminute"
                        value={yearlyStartsAtMinute}
                        name="yearlystartsatminute"
                        onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                        }
                    >
                        {minutes.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={12} sm={3} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="yearlystartsatampm"
                        value={yearlyStartsAtAmPm}
                        name="yearlystartsatampm"
                        onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                        }
                    >
                        <option value="am">
                            {t(
                                `scheduler.dashboard.modalConfig.form.select.options.am`
                            )}
                        </option>
                        <option value="pm">
                            {t(
                                `scheduler.dashboard.modalConfig.form.select.options.pm`
                            )}
                        </option>
                    </Form.Select>
                </Col>
            </Row>
        </>
    );
};

export default EditConfigurationMenuYearly;
