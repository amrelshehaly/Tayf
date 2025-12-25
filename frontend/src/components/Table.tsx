import { Branch } from "../types";


export type Column<T> = {
    header: string;
    render: (item: T) => React.ReactNode;
};

type GenericTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    getRowKey: (item: T) => string | number;
};



function SimpleTable<T>({ columns, data, getRowKey }: GenericTableProps<T>) {

    return (
        <table>
            <thead>
                <tr>
                    {columns.map((col, idx) => (
                        <th key={idx} scope="col">{col.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={getRowKey(item)}>
                        {columns.map((col, idx) => (
                            <td key={idx}>{col.render(item)}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default SimpleTable;