import { SetStateAction, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ArticuloManufacturadoService from '../../Functions/Services/ArticuloManufacturadoService';
import IArticuloManufacturado from '../../Entities/IArticuloManufacturado';
import masObject from '../../assets/circle-plus-svgrepo-com.svg';
import { Container, Row, Col, InputGroup, Form } from 'react-bootstrap';
import { Loader } from '../Loader/Loader';
import GrillaGenerica from './GrillaGenerica';
import { IPaginatedResponse } from '../../Entities/IPaginatedResponse';

export default function GrillaArticulo() {

    const apiUrl = import.meta.env.VITE_URL_API_BACK

    const [inputValue, setInputValue] = useState('');

    const [loading, setLoading] = useState(false);

    const [articulosManufacturados, setArticulosManufacturados] = useState<IArticuloManufacturado[]>([]);

    const mostrarDatos = (url:string)=>{
        try {
            console.log("entre");
            setLoading(true)
            const result = new ArticuloManufacturadoService(url);
            result.getAll()
            .then(data =>{
                setArticulosManufacturados(data);
            })
            .catch(err =>{
                console.error(err)
            })
        } catch (error) {
            console.error(error)
        }finally{
            setLoading(false);
        }
    }
    const searchItem = (value: string) => {
        const result = new ArticuloManufacturadoService(`${apiUrl}articulosManufacturados/name?nombre=`);
        result.getArticuloByName(value)
            .then(data => {
                // Verifica si 'data' es 'null' y proporciona un array vacío en su lugar
                setArticulosManufacturados(data ?? []);
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
        //console.log(event);
        new ArticuloManufacturadoService(`${apiUrl}articulosManufacturados`).delete(id);
        alert("Articulo removido con éxito!")
        window.location.reload;
    }

    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setInputValue(event.target.value);
    };

    if(loading){
        return <Loader/>;
    }

    useEffect(()=>{
        mostrarDatos(`${apiUrl}articulosManufacturados`)
        console.log(articulosManufacturados);
        
    },([apiUrl]))

    return (
        <Container>
            <Row className="my-3">
                <Col className="d-flex justify-content-between align-items-center">
                    <h1>Artículos</h1>
                    <Link to={'/panel-usuario/articulos/save/0'} className='btn btn-primary'>
                        <img src={masObject} alt="Crear Artículo" style={{ marginRight: '8px' }} />
                        Crear Artículo
                    </Link>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Busca un artículo"
                        />
                    </InputGroup>
                </Col>
            </Row>    
                <GrillaGenerica data={articulosManufacturados} propertiesToShow={["imagenes","denominacion","descripcion","precioVenta"]} editItem={`/panel-usuario/articulos/save/`} deleteFunction={handleDelete}></GrillaGenerica>
            {/* <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Denominación</th>
                        <th>Descripción</th>
                        <th>Precio Venta</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {articulosManufacturados.map((articulo: IArticuloManufacturado) => (
                        <tr key={articulo.id}>
                            <td>
                                <img width={64} height={64} src={`${apiUrl}imagenArticulos/uploads/${articulo.imagenes[0].url}`} alt="imagenArticulo" />
                            </td>
                            <td>{articulo.denominacion}</td>
                            <td>{articulo.descripcion}</td>
                            <td>{articulo.precioVenta}</td>
                            <td>
                                <Link to={"/panel-usuario/articulos/save/" + articulo.id} className="btn btn-warning me-2">
                                    Editar
                                </Link>
                                <Button variant="danger" onClick={() => handleDelete(articulo.id)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table> */}
        </Container>
    );
    
}