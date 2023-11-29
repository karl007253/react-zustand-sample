import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

type ConfigurationMenuDailyInputProps = {
    handleChange: (name: string, value: string) => void;
    optEveryday: boolean;
    optEveryWeekday: boolean;
    optEveryWeekend: boolean;
    dailyStartsAtHour: string;
    dailyStartsAtMinute: string;
    dailyStartsAtAmPm: string;
};

const EditConfigurationMenuDaily = ({
    handleChange,
    optEveryday,
    optEveryWeekday,
    optEveryWeekend,
    dailyStartsAtHour,
    dailyStartsAtMinute,
    dailyStartsAtAmPm,
}: ConfigurationMenuDailyInputProps) => {
    const { t } = useTranslation();

    const hours = Array.from(Array(13).keys()).slice(1);
    const minutes = Array.from(Array(60).keys());

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
                    sm={12}
                    className="d-flex align-items-center pt-2 text-philippine-gray"
                >
                    <Form.Check
                        type="radio"
                        id="opteveryday"
                        aria-label="opteveryday"
                        name="opteveryday"
                        label={t(
                            `scheduler.dashboard.modalConfig.form.label.everyday`
                        )}
                        onChange={(e) =>
                            handleChange(
                                e.target.name,
                                String(e.target.checked)
                            )
                        }
                        onClick={() =>
                            setOpt("opteveryday", String(!optEveryday))
                        }
                        checked={optEveryday}
                    />
                </Col>
            </Row>
            <Row>
                <Col
                    xs={12}
                    sm={12}
                    className="d-flex align-items-center pt-2 text-philippine-gray"
                >
                    <Form.Check
                        type="radio"
                        id="opteveryweekday"
                        aria-label="opteveryweekday"
                        name="opteveryweekday"
                        label={t(
                            `scheduler.dashboard.modalConfig.form.label.everyweekday`
                        )}
                        onChange={(e) =>
                            handleChange(
                                e.target.name,
                                String(e.target.checked)
                            )
                        }
                        onClick={() =>
                            setOpt("opteveryweekday", String(!optEveryWeekday))
                        }
                        checked={optEveryWeekday}
                    />
                </Col>
            </Row>
            <Row>
                <Col
                    xs={12}
                    sm={12}
                    className="d-flex align-items-center pt-2 text-philippine-gray"
                >
                    <Form.Check
                        type="radio"
                        id="opteveryweekend"
                        aria-label="opteveryweekend"
                        name="opteveryweekend"
                        label={t(
                            `scheduler.dashboard.modalConfig.form.label.everyweekend`
                        )}
                        onChange={(e) =>
                            handleChange(
                                e.target.name,
                                String(e.target.checked)
                            )
                        }
                        onClick={() =>
                            setOpt("opteveryweekend", String(!optEveryWeekend))
                        }
                        checked={optEveryWeekend}
                    />
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
                        aria-label="dailystartshour"
                        value={dailyStartsAtHour}
                        name="dailystartshour"
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
                <Col xs={12} sm={3} className="d-flex align-items-center">
                    <Form.Label className="d-flex align-items-center text-philippine-gray">
                        :
                    </Form.Label>
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="dailystartsminute"
                        value={dailyStartsAtMinute}
                        name="dailystartsminute"
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
                        aria-label="dailystartsampm"
                        value={dailyStartsAtAmPm}
                        name="dailystartsampm"
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

export default EditConfigurationMenuDaily;
