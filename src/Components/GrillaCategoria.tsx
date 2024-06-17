import { SetStateAction, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import masObject from '../assets/circle-plus-svgrepo-com.svg';
import { Container, Row, Col, InputGroup, Table, Button, Form } from 'react-bootstrap';
import ICategoria from '../Entities/ICategoria';
import CategoriaService from '../Functions/Services/CategoriaService';
export default function GrillaArticulo() {
    const [inputValue, setInputValue] = useState('');

    const [categorias, setCategorias] = useState<ICategoria[]>([]);

    const mostrarDatos =(url:string)=>{
        const result = new CategoriaService(url);
        result.getAll()
            .then(data =>{
                setCategorias(data);
            })
            .catch(error =>{
                console.log(error)
            })
    }
    const searchItem = (value: string) => {
        const result = new CategoriaService("http://localhost:8080/categorias/name?nombre=");
        result.getCategoryByDenominacion(value)
            .then(data => {
                // Verifica si 'data' es 'null' y proporciona un array vacío en su lugar
                setCategorias(data ?? []);
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
        const result = new CategoriaService("http://localhost:8080/categorias").delete(id);
        alert("Categoria removido con éxito!")
        window.location.reload;
    }

    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        mostrarDatos("http://localhost:8080/categorias")
    }, ([]))

    return (
        <Container>
            <Row className="my-3">
                <Col className="d-flex justify-content-between align-items-center">
                    <h1>Categorias</h1>
                    <Link to={'save/0'} className='btn btn-primary'>
                        <img src={masObject} alt="Crear Categoria" style={{ marginRight: '8px' }} />
                        Crear Categoria
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
                            placeholder="Busca una categoria"
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Denominación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((categoria: ICategoria) => (
                        <tr key={categoria.id}>
                            <td>{categoria.denominacion}</td>
                            <td>
                                <Link to={"save/" + categoria.id} className="btn btn-warning me-2">
                                    Editar
                                </Link>
                                <Button variant="danger" onClick={() => handleDelete(categoria.id)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
    
}