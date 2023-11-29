import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

type ApiAuthenticationInfoTableProps = {
    label?: string;
    tableName: string;
    headers: {
        name: string;
        columnWidth?: string;
    }[];
    body: string[][];
};

/**
 * A custom-styled reusable table tailored for EMobiq design system
 * @param {string} tableName optional title for this table
 * @param {{name:string, columnWidth?:string}} headers list of header names for the table, optional CSS column widths
 *      can be provided, in which the number of items should be equivalent to the amount of columns. Any valid CSS dimensions
 *      is accepted (%, px, em etc.)  For example, for a 3-column table, the value can be ["50%", "30%", "20%"]. If this value
 *      is unspecified or for remaining columns where header.length > columnWidths.length, a value of CSS "auto" will be used.
 * @param {string[][]} body list of rows for this table. Each rows contain list of cells, in which the column is mapped by
 *      their index of the header. For a 3-column table, this array size should be Nx3, where N is the number of rows in the table.
 * @param {string?} label optional ARIA label for this table
 */
const ApiAuthenticationInfoTable = ({
    label,
    tableName,
    headers,
    body,
}: ApiAuthenticationInfoTableProps) => {
    const { t } = useTranslation();
    return (
        <div className="api-authentication-information-table">
            <h3 className="table-title">{t(tableName)}</h3>
            <Table responsive borderless className="mb-4" aria-label={label}>
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header.name}
                                style={{
                                    fontWeight: "normal",
                                    width: header.columnWidth || "auto",
                                }}
                            >
                                {t(header.name)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {body.map((line) => (
                        <tr key={line.toString()}>
                            {line.map((cell) => (
                                <td key={cell}>{t(cell)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ApiAuthenticationInfoTable;
export type { ApiAuthenticationInfoTableProps };
