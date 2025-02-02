import GrillaRow from "./GrillaRow"
import { Table } from 'react-bootstrap';

interface GrillaProps<T> {
    data: T[]
    propertiesToShow: (keyof T)[]
    editItem?: string
    deleteFunction?: (id:number)=>void
}

export default function GrillaGenerica<T>({ data, propertiesToShow,editItem,deleteFunction }: GrillaProps<T>) {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {propertiesToShow.map((property, index) => (
                        <th key={index}>{String(property)}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <GrillaRow key={index}
                        data={item}
                        propertiesToShow={propertiesToShow}
                        isActions={true}
                        urlParent={editItem}
                        onDelete={deleteFunction}
                    />
                ))}
            </tbody>
        </Table>
    )
}