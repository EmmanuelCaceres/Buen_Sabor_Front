import { useEffect, useState } from 'react';
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import { Container, Row, Col, InputGroup, Table, Button, Form } from 'react-bootstrap';
import IPedido from '../Entities/IPedido';
import PedidoService from '../Functions/Services/PedidoService';
import IDetallePedido from '../Entities/IDetallePedido';

export default function Pedidos() {

    const [visible, setVisible] = useState(false);

    const [pedidos, setPedidos] = useState<IPedido[]>([]);

    const [detallePedidos,setDetallePedidos] = useState<IDetallePedido[]>([])

    const getPedidos = async (url: string) => {
        const result = new PedidoService(url)
        result.getAll()
            .then((data) => {
                setPedidos(data);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleModal = (detalles:IDetallePedido[]) =>{
        setDetallePedidos(detalles)
        console.log(detalles)
        setVisible(true)
    }

    useEffect(() => {
        getPedidos("http://localhost:8080/pedido");
    }, [])


    return (
        <Container>
            <Row className="my-3">
                <Col className="d-flex justify-content-between align-items-center">
                    <h1>Pedidos</h1>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Fecha del pedido</th>
                        <th>Total</th>
                        <th>Costo total</th>
                        <th>Detalles</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido: IPedido) => (
                        <tr key={pedido.id}>
                            <td>{pedido.fechaPedido}</td>
                            <td>{pedido.total}</td>
                            <td>{pedido.totalCosto}</td>
                            <td>
                                <CButton color="primary" onClick={() => handleModal(pedido.detallePedidos)}>Ver Detalles</CButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalHeader>
                    <CModalTitle id="LiveDemoExampleLabel">Detalles del pedido</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {
                        detallePedidos.map((detalle: IDetallePedido,index:number) => (
                            <div key={index} style={{padding:"1rem 1rem ",margin:"1rem .5rem",display:"flex",flexDirection:"row",gap:"1rem",border:"1px solid rgb(239 243 249)",borderRadius:"10px"}}>
                                <img width={80} height={80} src={'http://localhost:8080/imagenArticulos/uploads/' +detalle.articulo.imagenes[0].url} alt="" />
                                <div>
                                    <p>Cantidad: {detalle.cantidad}</p>
                                    <p>{detalle.articulo.denominacion} - ${detalle.articulo.precioVenta}</p>
                                    <p>Subtotal: ${detalle.subTotal}</p>
                                </div>
                            </div>
                        ))
                    }
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Cerrar
                    </CButton>
                </CModalFooter>
            </CModal>
        </Container>
    )
}