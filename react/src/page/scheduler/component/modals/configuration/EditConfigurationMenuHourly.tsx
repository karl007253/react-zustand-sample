import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

// to send event to the parent component menu
type ConfigurationMenuHourlyInputProps = {
    handleChange: (name: string, value: string) => void;
    hourlyEveryHour: string;
    hourlyStartsAtHour: string;
    hourlyStartsAtMinute: string;
    hourlyStartsAtAmPm: string;
};

const EditConfigurationMenuHourly = ({
    handleChange,
    hourlyEveryHour,
    hourlyStartsAtHour,
    hourlyStartsAtMinute,
    hourlyStartsAtAmPm,
}: ConfigurationMenuHourlyInputProps) => {
    const { t } = useTranslation();
    // set initial for the input hours and minutes select options
    const everyhours = Array.from(Array(24).keys()).slice(1);
    const hours = Array.from(Array(13).keys()).slice(1);
    const minutes = Array.from(Array(60).keys());

    return (
        <>
            <Row>
                <Col
                    xs={12}
                    sm={2}
                    className="d-flex align-items-center text-philippine-gray"
                >
                    <Form.Label className="text-philippine-gray px-12 pt-10">
                        {t(`scheduler.dashboard.modalConfig.form.label.every`)}
                    </Form.Label>
                </Col>
                <Col xs={12} sm={3} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="everyhours"
                        onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                        }
                        name="everyhours"
                        value={hourlyEveryHour}
                    >
                        {everyhours.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={12} sm={2} className="d-flex align-items-center">
                    <Form.Label className="text-philippine-gray pt-10">
                        {t(`scheduler.dashboard.modalConfig.form.label.hours`)}
                    </Form.Label>
                </Col>
            </Row>
            <Row>
                <Col
                    xs={12}
                    sm={2}
                    className="d-flex align-items-center text-philippine-gray"
                >
                    <Form.Label className="text-philippine-gray px-12 pt-10">
                        {t(
                            `scheduler.dashboard.modalConfig.form.label.startsat`
                        )}
                    </Form.Label>
                </Col>
                <Col xs={12} sm={3} className="d-flex align-items-center">
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="startshours"
                        name="startshours"
                        onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                        }
                        value={hourlyStartsAtHour}
                    >
                        {hours.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={12} sm={4} className="d-flex align-items-center">
                    <Form.Label className="d-flex align-items-center text-philippine-gray">
                        :
                    </Form.Label>
                    <Form.Select
                        className="text-sm m-1"
                        aria-label="startsminutes"
                        name="startsminutes"
                        value={hourlyStartsAtMinute}
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
                        aria-label="hourlystartsampm"
                        value={hourlyStartsAtAmPm}
                        name="hourlystartsampm"
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

export default EditConfigurationMenuHourly;
