import { SetStateAction, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import masObject from '../../assets/circle-plus-svgrepo-com.svg';
import { Container, Row, Col, InputGroup, Table, Button, Form } from 'react-bootstrap';
import ICategoria from '../../Entities/ICategoria';
import CategoriaService from '../../Functions/Services/CategoriaService';
import GrillaGenerica from './GrillaGenerica';

export default function GrillaCategoria() {

    const apiUrl = import.meta.env.VITE_URL_API_BACK

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
        const result = new CategoriaService(`${apiUrl}categorias/name?nombre=`);
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
        new CategoriaService(`${apiUrl}categorias`).delete(id);
        alert("Categoria removido con éxito!")
        window.location.reload;
    }

    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        console.log("Entre a categorías");
        mostrarDatos(`${apiUrl}categorias`)
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
            <GrillaGenerica data={categorias} propertiesToShow={["denominacion"]} editItem={`/panel-usuario/categorias/save/`} deleteFunction={handleDelete}/>
        </Container>
    );
}