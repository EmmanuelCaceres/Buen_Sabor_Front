import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import arrow_left from "../assets/arrow-circle-left-svgrepo-com.svg";
import ICategoria from "../Entities/ICategoria";
import CategoriaService from "../Functions/Services/CategoriaService";

export default function SaveCategoria() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;
    const { id } = useParams();
    const navigate = useNavigate();
    const [categoriasPadre,setCategoriasPadre] = useState<ICategoria[]>([]);
    const [categoria, setCategoria] = useState<ICategoria>({
        id: 0,
        baja: false,
        denominacion: '',
        subCategorias: [],
        articulos: [],
        esInsumo: false,
        sucursales:[],
        esParaVender:false,
        categoriaPadre: {
            id: 0,
            baja: false,
            denominacion: '',
            subCategorias: [],
            articulos: [],
            esInsumo: false,
            categoriaPadre: null,
            sucursales:[],
            esParaVender:false
        }
    });

    const obtenerCategoriasPadre = useCallback( async () => {
        try {
            const result = new CategoriaService(apiUrl);
            const data = await result.getAllParents();
            setCategoriasPadre(data);
        } catch (error) {
            console.error("Error al obtener categorías padre:", error);
        }
    },[apiUrl]);

    const getCategoryByDenominacion = async (baseUrl: string, id: number) => {
        const result = new CategoriaService(baseUrl);
        await result.get(id)
            .then(data => {
                if (data !== null) {
                    setCategoria(data);
                    console.log("DATA: " + JSON.stringify(data, null, 2));
                } else {
                    console.log("La categoria no se encontró.");
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const SaveCategoria = async () => {
        if (Number(id) !== 0) {
            await new CategoriaService(`${apiUrl}categorias`).put(Number(id), categoria);
        } else {
            await new CategoriaService(`${apiUrl}categorias`).post(categoria);
        }
        alert("Categoria guardada con exito!");
        navigate(-1);
    };

    useEffect(() => {
        obtenerCategoriasPadre();
        if (Number(id) !== 0) {
            getCategoryByDenominacion(`${apiUrl}categorias`, Number(id));
        }
    }, [id]);

    return (
        <div className="container">
            <Link to="/categorias" className="btnVolver">
                <img width={24} height={24} src={arrow_left} alt="arrow_left" />
                <p style={{ margin: "0" }}>Volver</p>
            </Link>
            <form className="formContainer">
                <label htmlFor="denominacion">Nombre de la categoria</label>
                <input
                    type="text"
                    id="denominacion"
                    name="denominacion"
                    value={categoria.denominacion}
                    onChange={(e) => setCategoria({ ...categoria, denominacion: e.target.value })}
                />

                <div className="form-check-inline" style={{ display: 'flex', gap: '10px' }}>
                    <label className="form-check-label" htmlFor="esInsumo">Es Insumo?</label>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="esInsumo"
                        checked={categoria.esInsumo}
                        onChange={(e) => setCategoria({ ...categoria, esInsumo: e.target.checked })}
                    />
                </div>
                <div className="form-check-inline" style={{ display: 'flex', gap: '10px' }}>
                    <label className="form-check-label" htmlFor="esParaVender">¿Es para vender?</label>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="esParaVender"
                        checked={categoria.esParaVender}
                        onChange={(e) => setCategoria({ ...categoria, esParaVender: e.target.checked })}
                    />
                </div>

                <br />
                <div className="mb-3 d-flex align-items-center gap-2">
                    <label htmlFor="categoriaPadre" style={{ minWidth: "120px" }}>Categoría Padre:</label>
                    <select
                        id="categoriaPadre"
                        className="form-select"
                        style={{ maxWidth: "300px" }}
                        value={categoria.categoriaPadre?.id || 0}
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            const selectedCategoria = {
                                id: selectedId,
                                baja: false,
                                denominacion: '',
                                subCategorias: [],
                                articulos: [],
                                esInsumo: false,
                                categoriaPadre: null,
                                sucursales: [],
                                esParaVender:false
                            };
                            setCategoria({ ...categoria, categoriaPadre: selectedId === 0 ? null : selectedCategoria });
                        }}
                    >
                    <option value={0}>Selecciona una categoría padre</option>
                    {categoriasPadre.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.denominacion}
                        </option>
                    ))}
                </select>
            </div>

            </form>


            <button className="btn btn-primary" onClick={SaveCategoria}>Guardar</button>
        </div>
    );
}
