import { SetStateAction, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ArticuloManufacturadoService from '../Functions/Services/ArticuloManufacturadoService';
import IArticuloManufacturado from '../Entities/IArticuloManufacturado';
import masObject from '../assets/circle-plus-svgrepo-com.svg';
import { Container, Row, Col, InputGroup, Table, Button, Form } from 'react-bootstrap';
export default function GrillaArticulo() {
    const [inputValue, setInputValue] = useState('');

    const [articulosManufacturados, setArticulosManufacturados] = useState<IArticuloManufacturado[]>([]);

    const mostrarDatos =(url:string)=>{
        const result = new ArticuloManufacturadoService(url);
        result.getAll()
            .then(data =>{
                setArticulosManufacturados(data);
            })
            .catch(error =>{
                console.log(error)
            })
    }
    const searchItem = (value: string) => {
        const result = new ArticuloManufacturadoService("http://localhost:8080/articuloManufacturados/name?nombre=");
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
        const result = new ArticuloManufacturadoService("http://localhost:8080/articuloManufacturados").delete(id);
        alert("Articulo removido con éxito!")
        window.location.reload;
    }

    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        mostrarDatos("http://localhost:8080/articuloManufacturados")
    }, ([]))

    return (
        <Container>
            <Row className="my-3">
                <Col className="d-flex justify-content-between align-items-center">
                    <h1>Artículos</h1>
                    <Link to={'save/0'} className='btn btn-primary'>
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
            <Table striped bordered hover>
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
                                <img width={64} height={64} src={'http://localhost:8080/imagenArticulos/uploads/' + articulo.imagenes[0].url} alt="imagenArticulo" />
                            </td>
                            <td>{articulo.denominacion}</td>
                            <td>{articulo.descripcion}</td>
                            <td>{articulo.precioVenta}</td>
                            <td>
                                <Link to={"save/" + articulo.id} className="btn btn-warning me-2">
                                    Editar
                                </Link>
                                <Button variant="danger" onClick={() => handleDelete(articulo.id)}>
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

{/* <div id="country_code" class="w-1/4">
                                <select id="select_country_code"  name="country_code" class="hidden" value="+54">
                                    <option value="+54">{{__('forms.area_code.Argentina') }} </option>
                                    <option value="+591">{{__('forms.area_code.Bolivia') }} </option>
                                    <option value="+55">{{__('forms.area_code.Brasil') }} </option>
                                    <option value="+56">{{__('forms.area_code.Chile') }}  </option>
                                    <option value="+57">{{__('forms.area_code.Colombia') }} </option>
                                    <option value="+506">{{__('forms.area_code.Costa_Rica') }} </option>
                                    <option value="+53">{{__('forms.area_code.Cuba') }} </option>
                                    <option value="+593">{{__('forms.area_code.Ecuador') }} </option>
                                    <option value="+503">{{__('forms.area_code.El_Salvador') }} </option>
                                    <option value="+502">{{__('forms.area_code.Guatemala') }} </option>
                                    <option value="+504">{{__('forms.area_code.Honduras') }} </option>
                                    <option value="+52">{{__('forms.area_code.Mexico') }} </option>
                                    <option value="+505">{{__('forms.area_code.Nicaragua') }} </option>
                                    <option value="+507">{{__('forms.area_code.Panama') }} </option>
                                    <option value="+595">{{__('forms.area_code.Paraguay') }} </option>
                                    <option value="+51">{{__('forms.area_code.Peru') }} </option>
                                    <option value="+1">{{__('forms.area_code.Puerto_Rico') }} </option>
                                    <option value="+1">{{__('forms.area_code.Republica_Dominicana') }} </option>
                                    <option value="+598">{{__('forms.area_code.Uruguay') }} </option>
                                    <option value="+58">{{__('forms.area_code.Venezuela') }}</option>
                                </select>
                                <div class=" relative select-form form-input-select">
                                    +54
                                </div>
                                <div class="find_country h-fit bg-white px-2 pt-4 absolute rounded-[10px] list-shadow" style="width: 217px">
                                    <ul class="select-options-country w-full pr-4 pl-2 relative border-0">
                                    </ul>
                                </div>
                                </div> */}