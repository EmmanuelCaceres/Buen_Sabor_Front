import GrillaRow from "./GrillaRow";
import { Table } from "react-bootstrap";

interface GrillaProps<T extends { id: number }> {
    data: T[];
    propertiesToShow: (keyof T)[];
    columnAliases?: Partial<Record<keyof T, string>>; // Más seguro, restringido a claves de T
    editItem?: string;
    deleteFunction?: (id: number) => void;
}

export default function GrillaGenerica<T extends { id: number }>({
    data,
    propertiesToShow,
    columnAliases = {},
    editItem,
    deleteFunction,
}: GrillaProps<T>) {
    const hasActions = !!editItem || !!deleteFunction;

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    {propertiesToShow.map((property) => (
                        <th key={String(property)} scope="col">
                            {columnAliases?.[property] ?? String(property)}
                        </th>
                    ))}
                    {hasActions && <th scope="col">Acciones</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <GrillaRow
                        key={item.id}
                        data={item}
                        propertiesToShow={propertiesToShow}
                        isActions={hasActions}
                        urlParent={editItem}
                        onDelete={deleteFunction}
                    />
                ))}
            </tbody>
        </Table>
    );
}
