import { SetStateAction, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ArticuloInsumoService from '../Functions/Services/ArticuloInsumoService';
import masObject from '../assets/circle-plus-svgrepo-com.svg';
import IArticuloInsumo from '../Entities/IArticuloInsumo';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';
export default function GrillaArticulo() {
    const [inputValue, setInputValue] = useState('');

    const [articulosInsumos, setArticulosinsumos] = useState<IArticuloInsumo[]>([]);

    const mostrarDatos =(url:string)=>{
        const result = new ArticuloInsumoService(url);
        result.getAll()
            .then(data =>{
                setArticulosinsumos(data);
            })
            .catch(error =>{
                console.log(error)
            })
    }
    const searchItem = (value: string) => {
        const result = new ArticuloInsumoService("http://localhost:8080/articuloInsumos/name?nombre=");
        result.getInsumoByDenominacion(value)
            .then(data => {
                // Verifica si 'data' es 'null' y proporciona un array vacío en su lugar
                setArticulosinsumos(data ?? []);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleKeyPress = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            console.log(inputValue)
            searchItem(inputValue);
        }
    };

    const handleDelete = (id:number) => {
        console.log(event);
        const result = new ArticuloInsumoService("http://localhost:8080/articuloInsumos").delete(id);
        window.location.reload;
    }

    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        mostrarDatos("http://localhost:8080/articuloInsumos")
    }, ([]))

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center my-3">
                <h1>Insumos</h1>
                <Link to={'save/0'} className='btn btn-primary'>
                    <img src={masObject} alt="Crear Insumo" style={{ marginRight: '8px' }} />
                    Crear Insumo
                </Link>
            </div>
            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Busca un insumo..."
                />
            </InputGroup>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Denominación</th>
                        <th>Categoría</th>
                        <th>Unidad de Medida</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {articulosInsumos.map((insumo: IArticuloInsumo) => (
                        <tr key={insumo.id}>
                            <td>
                                <img width={50} height={50} src={'http://localhost:8080/imagenArticulos/uploads/' + insumo.imagenes[0].url} alt="imagenArticulo" />
                            </td>
                            <td>{insumo.denominacion}</td>
                            <td>{insumo.categoria.denominacion}</td>
                            <td>{insumo.unidadMedida.denominacion}</td>
                            <td>
                                <Link to={"save/" + insumo.id} className="btn btn-warning me-2">
                                    Editar
                                </Link>
                                <Button variant="danger" onClick={() => handleDelete(insumo.id)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}