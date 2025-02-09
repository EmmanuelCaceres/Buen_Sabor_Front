import GrillaRow from "./GrillaRow";
import { Table } from "react-bootstrap";

interface GrillaProps<T extends { id: number }> {
    data: T[];
    propertiesToShow: (keyof T)[];
    editItem?: string;
    deleteFunction?: (id: number) => void;
}

export default function GrillaGenerica<T extends { id: number }>({
    data,
    propertiesToShow,
    editItem,
    deleteFunction,
}: GrillaProps<T>) {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {propertiesToShow.map((property) => (
                        <th key={String(property)}>{String(property)}</th>
                    ))}
                    {(editItem || deleteFunction) && <th>Acciones</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <GrillaRow
                        key={item.id}
                        data={item}
                        propertiesToShow={propertiesToShow}
                        isActions={!!editItem || !!deleteFunction}
                        urlParent={editItem}
                        onDelete={deleteFunction}
                    />
                ))}
            </tbody>
        </Table>
    );
}
