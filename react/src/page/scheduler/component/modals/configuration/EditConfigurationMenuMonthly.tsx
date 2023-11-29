import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

type ConfigurationMenuMonthlyInputProps = {
    handleChange: (name: string, value: string) => void;
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
};

const EditConfigurationMenuMonthly = ({
    handleChange,
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
}: ConfigurationMenuMonthlyInputProps) => {
    const { t } = useTranslation();

    const hours = Array.from(Array(13).keys()).slice(1);
    const minutes = Array.from(Array(60).keys());
    // const daysNumber = Array.from(Array(8).keys()).slice(1);
    // const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    // const daysNumber = [1, 2, "wed", "thu", "fri", "sat", "sun"];
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
    const months = Array.from(Array(12).keys()).slice(1);
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
                    className="d-flex align-items-center pt-2 text-philippine-gray wp-15"
                >
                    <Form.Check
                        type="radio"
                        id="optmonthlyday"
                        aria-label="optmonthlyday"
                        name="optmonthlyday"
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
                            setOpt("optmonthlyday", String(!optMonthlyDay))
                        }
                        checked={optMonthlyDay}
                    />
                </Col>
                <Col xs={12} sm={2} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="monthlyeveryday"
                        value={monthlyEveryDay}
                        name="monthlyeveryday"
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
                <Col xs={12} sm={2} className="d-flex align-items-center">
                    <Form.Label className="d-flex align-items-center text-philippine-gray px-12">
                        {t(
                            `scheduler.dashboard.modalConfig.form.label.ofevery`
                        )}
                    </Form.Label>
                </Col>
                <Col xs={12} sm={2} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="monthlyeverymonth"
                        value={monthlyEveryMonth}
                        name="monthlyeverymonth"
                        onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                        }
                    >
                        {months.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={12} sm={2} className="d-flex align-items-center">
                    <Form.Label className="d-flex align-items-center text-philippine-gray px-6">
                        {t(`scheduler.dashboard.modalConfig.form.label.months`)}
                    </Form.Label>
                </Col>
            </Row>
            <Row>
                <Col
                    xs={12}
                    className="d-flex align-items-center pt-2 text-philippine-gray wp-15"
                >
                    <Form.Check
                        type="radio"
                        id="optmonthlyweek"
                        aria-label="optmonthlyweek"
                        name="optmonthlyweek"
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
                            setOpt("optmonthlyweek", String(!optMonthlyWeek))
                        }
                        checked={optMonthlyWeek}
                    />
                </Col>
                <Col xs={12} sm={2} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="monthlyquarter"
                        name="monthlyquarter"
                        value={monthlyQuarter}
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
                <Col xs={12} sm={2} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm"
                        aria-label="monthlyquarterday"
                        value={monthlyQuarterDay}
                        name="monthlyquarterday"
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
                <Col xs={12} className="d-flex align-items-center wp-15">
                    <Form.Label className="d-flex align-items-center text-philippine-gray ms-7">
                        {t(
                            `scheduler.dashboard.modalConfig.form.label.ofevery`
                        )}
                    </Form.Label>
                </Col>
                <Col xs={12} sm={2} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="monthlyquartermonth"
                        value={monthlyQuarterMonth}
                        name="monthlyquartermonth"
                        onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                        }
                    >
                        {months.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={12} sm={1} className="d-flex align-items-center">
                    <Form.Label className="d-flex align-items-center text-philippine-gray px-6">
                        {t(`scheduler.dashboard.modalConfig.form.label.months`)}
                    </Form.Label>
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
                        aria-label="monthlystartsathour"
                        value={monthlyStartsAtHour}
                        name="monthlystartsathour"
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
                        aria-label="monthlystartsatminute"
                        value={monthlyStartsAtMinute}
                        name="monthlystartsatminute"
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
                        aria-label="monthlystartsatampm"
                        value={monthlyStartsAtAmPm}
                        name="monthlystartsatampm"
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

export default EditConfigurationMenuMonthly;
