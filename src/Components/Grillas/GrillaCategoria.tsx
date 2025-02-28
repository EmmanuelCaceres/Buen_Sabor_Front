import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import masObject from '../../assets/circle-plus-svgrepo-com.svg';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ICategoria from '../../Entities/ICategoria';
import CategoriaService from '../../Functions/Services/CategoriaService';
import GrillaGenerica from './GrillaGenerica';
import './ButtonActivo.css';

import { InputSearch } from '../../Components';

export default function GrillaCategoria() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;
    const [categorias, setCategorias] = useState<ICategoria[]>([]);
    const [activeButton, setActiveButton] = useState<'insumos' | 'manufacturados' | 'todas' | null>(null); // Estado para el botón activo

    // Función para mostrar todas las categorías
    const mostrarDatos = (url: string) => {
        const result = new CategoriaService(url);
        result.getAll()
            .then(data => {
                if (Array.isArray(data)) {
                    setCategorias(data);
                } else if ('content' in data && Array.isArray(data.content)) {
                    setCategorias(data.content);
                } else {
                    setCategorias([]);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };
    // Función de búsqueda por denominación
    const searchItem = (value: string) => {
        const result = new CategoriaService(`${apiUrl}categorias/filter?keyword=`);
        result.filterByKeyword(true,value)
            .then(data => {
                if (Array.isArray(data)) {
                    setCategorias(data);
                } else if ('content' in data && Array.isArray(data.content)) {
                    setCategorias(data.content);
                } else {
                    setCategorias([]);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };
    // Función para eliminar una categoría
    const handleDelete = (id: number) => {
        new CategoriaService(`${apiUrl}categorias`).delete(id);
        alert("Categoria removido con éxito!");
        window.location.reload();
    };
    // Función para manejar el clic en los botones
    const handleButtonClick = (buttonType: 'insumos' | 'manufacturados' | 'todas') => {
        setActiveButton(buttonType); // Cambiar el botón activo
        if (buttonType === 'todas') {
            mostrarDatos(`${apiUrl}categorias`); // Mostrar todas las categorías
        } else if (buttonType === 'insumos') {
            mostrarDatos(`${apiUrl}categorias/paged/categoriasInsumos`);
        } else if (buttonType === 'manufacturados') {
            mostrarDatos(`${apiUrl}categorias/paged/categoriasManufacturados`);
        }
    };

    // Cargar las categorías por defecto al iniciar
    useEffect(() => {
        mostrarDatos(`${apiUrl}categorias/paged`); // Por defecto, cargar todas las categorías
    }, [apiUrl]);


    return (
        <Container>
            <Row className="my-3">
                <Col className="d-flex justify-content-between align-items-center">
                    <h1>Categorias</h1>
                    <Link to={'save/0'} className='btn btn-success'>
                        <img src={masObject} alt="Crear Categoria" style={{ marginRight: '8px' }} />
                        Crear Categoria
                    </Link>
                </Col>
            </Row>

            {/* Botones para cargar categorías de insumos, manufacturados y todas */}
            <Row className="my-1 btn-container">
                <Col className="btn-container">
                    <Button
                        className={`btn-naranja ${activeButton === 'todas' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('todas')}
                    >
                        Todas las Categorías
                    </Button>

                    <Button
                        className={`btn-naranja ${activeButton === 'insumos' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('insumos')}
                    >
                        Insumos
                    </Button>

                    <Button
                        className={`btn-naranja ${activeButton === 'manufacturados' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('manufacturados')}
                    >
                        Manufacturados
                    </Button>
                </Col>
            </Row>


            <Row className="mb-3">
                <Col>
                    <InputSearch label={"Buscar categoría"} customMethod={searchItem}/>
                </Col>
            </Row>

            <GrillaGenerica data={categorias} propertiesToShow={["denominacion"]} editItem={`/panel-usuario/categorias/save/`} deleteFunction={handleDelete} />
        </Container>
    );
}
