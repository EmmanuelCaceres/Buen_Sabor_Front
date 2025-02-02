
import { ButtonEdit } from "../../Components";

interface infoRow<T> {
    data: T;
    propertiesToShow: (keyof T)[];
    isActions: boolean;
    urlParent?: string;
    onDelete?: (id:number) => void;
}

export default function GrillaRow<T>({ data, propertiesToShow, isActions, onDelete, urlParent }: infoRow<T>) {
    return (
        <tr>
            {propertiesToShow.map((property, index) => (
                <td key={index}>{data[property]}</td>
            ))}
            {isActions && (
                <td>
                    <ButtonEdit label={"Editar"} url={urlParent?urlParent+String(data["id"]):""}/>
                    <button onClick={() => onDelete && onDelete(Number(data["id"]))}>Delete</button>
                </td>)
            }
        </tr>
    )
}