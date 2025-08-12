import { LabelPublic } from "../../Components"
import { Link } from "react-router-dom"
import "./Home.css"
import { useEffect, useState } from "react"
import ICategoria from "../../Entities/ICategoria"
import imagenPorDefecto from "../../assets/imagenes/empresa.jpg"
import IPromocionGet from "../../Entities/IPromocionGet"

export const Home = () => {
    const apiUrl = import.meta.env.VITE_URL_API_BACK
    const [categories, setCategories] = useState<ICategoria[]>([])
    const [promociones, setPromociones] = useState<IPromocionGet[]>([])

    const getAllCategories = async () => {
        try {
            const response = await fetch(`${apiUrl}categorias/getAll`);
            const data = await response.json();
            setCategories(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const getAllPromociones = async () => {
        try {
            const response = await fetch(`${apiUrl}promociones`);
            const data = await response.json();
            setPromociones(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching promociones:", error);
        }
    };

    useEffect(() => {
        getAllCategories();
        getAllPromociones();
    }, [apiUrl])

    return (
        <>
            <section>
                <LabelPublic text="Promociones espectaculares" />
                <div style={{ display: "flex", gap: "16px", overflowX: "auto", padding: "24px 0" }}>
                    {
                        promociones.map((promocion: IPromocionGet) => (
                            <Link key={promocion.id} to={`/description/${promocion.id}`} className="card-producto">
                                <img src={``}
                                    alt=""
                                    onError={(e) => {
                                        e.currentTarget.onerror = null; // Evita bucles infinitos si la imagen por defecto también falla
                                        e.currentTarget.src = imagenPorDefecto;
                                    }} />
                                <p>{promocion.denominacion}</p>
                            </Link>
                        ))
                    }
                </div>
            </section>
            <section>
                <LabelPublic text="Basados en categorías" />
                <div style={{ display: "flex", gap: "16px", overflowX: "auto", padding: "24px 0" }}>
                    {
                        categories.map((category: ICategoria) => (
                            <Link key={category.id} to='/description' className="card-producto">
                                <img src={`/${category.denominacion}-home.jpg`}
                                    alt=""
                                    onError={(e) => {
                                        e.currentTarget.onerror = null; // Evita bucles infinitos si la imagen por defecto también falla
                                        e.currentTarget.src = imagenPorDefecto;
                                    }} />
                                <p>{category.denominacion}</p>
                                <p>{category.id}</p>
                            </Link>
                        ))
                    }
                </div>
            </section>
            <LabelPublic text="Descubre nuestros productos estrellas" />
        </>

    )
}