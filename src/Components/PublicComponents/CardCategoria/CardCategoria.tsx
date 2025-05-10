import "./CardCategoria.css"

interface CardCategoriaProps {
    url: string;
    title: string;
}

export const CardCategoria = ({ url, title }: CardCategoriaProps) => {
    return (
        <div className="card-categoria background-amarillo-10">
            <img width={"60px"} height={"60px"} src={url} alt={title}/>
            <p>{title}</p>
        </div>
    )
}