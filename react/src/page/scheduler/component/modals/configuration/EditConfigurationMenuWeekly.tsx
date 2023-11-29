import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface DaysWeek {
    day: string;
    name: string;
    checked: boolean;
}

type ConfigurationMenuWeeklyInputProps = {
    handleChange: (name: string, value: string) => void;
    weeklyStartsAtHour: string;
    weeklyStartsAtMinute: string;
    weeklyStartsAtAmPm: string;
    optWeeklyDays: DaysWeek[];
};

const EditConfigurationMenuWeekly = ({
    handleChange,
    weeklyStartsAtHour,
    weeklyStartsAtMinute,
    weeklyStartsAtAmPm,
    optWeeklyDays,
}: ConfigurationMenuWeeklyInputProps) => {
    const { t } = useTranslation();

    const hours = Array.from(Array(13).keys()).slice(1);
    const minutes = Array.from(Array(60).keys());

    return (
        <>
            <Row>
                <Col
                    xs={12}
                    sm={10}
                    className="align-items-center pt-2 text-philippine-gray"
                >
                    {optWeeklyDays.map((d) => (
                        <Form.Check
                            className="m-1 px-12 daysradio"
                            type="radio"
                            id={`optweeklydays-${d.name}`}
                            aria-label={`optweeklydays[${d.day}]`}
                            name={`optweeklydays[${d.day}]`}
                            label={t(
                                `scheduler.dashboard.modalConfig.form.label.${d.name}`
                            )}
                            value={`${d.day}`}
                            key={`${d.day}`}
                            onChange={(e) =>
                                handleChange(e.target.name, e.target.value)
                            }
                            onClick={() =>
                                handleChange(
                                    `optweeklydays[${d.day}]`,
                                    `${d.day}`
                                )
                            }
                            checked={d.checked}
                        />
                    ))}
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
                <Col xs={12} sm={2} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="weeklystartshours"
                        value={weeklyStartsAtHour}
                        name="weeklystartshours"
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
                <Col xs={12} sm={2} className="d-flex align-items-center">
                    <Form.Label className="d-flex align-items-center text-philippine-gray">
                        :
                    </Form.Label>
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="weeklystartsminute"
                        value={weeklyStartsAtMinute}
                        name="weeklystartsminute"
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
                <Col xs={12} sm={2} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="weeklystartsampm"
                        value={weeklyStartsAtAmPm}
                        name="weeklystartsampm"
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

export default EditConfigurationMenuWeekly;
