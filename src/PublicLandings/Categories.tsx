
import { CardCategoria } from "../Components";

export default function Categories() {
    const categories = [
        { url: "https://cdn-icons-png.flaticon.com/512/1040/1040214.png", title: "Tecnología" },
        { url: "https://cdn-icons-png.flaticon.com/512/1040/1040214.png", title: "Tecnología" },
        { url: "https://cdn-icons-png.flaticon.com/512/1040/1040214.png", title: "Tecnología" },
        { url: "https://cdn-icons-png.flaticon.com/512/1040/1040214.png", title: "Tecnología" },
        { url: "https://cdn-icons-png.flaticon.com/512/1040/1040214.png", title: "Tecnología" },
    ]
    return (
        <>
        <section style={{padding: "24px 16px"}} className="background-naranja-70">
            <h1 style={{fontSize:"26px", fontWeight:"600",padding:"0 0 24px 0", margin:"0"}} className="text-secondary">Categorías</h1>
            <p style={{margin:"0"}}>No importa tu mood, tenemos la comida ideal. Échale un vistazo a nuestras categorías y pide lo que más te apetece ahora mismo. ¡Así de fácil!</p>
        </section>
        <section style={{padding: "24px 16px"}}>
            <h2 style={{fontSize:"20px", fontWeight:"500",padding:"0 0 24px 0", margin:"0"}}>Tecnología</h2>
            <div className="slider-container">
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
            </div>
            <h2 style={{fontSize:"20px", fontWeight:"500",padding:"0 0 24px 0", margin:"0"}}>Tecnología</h2>
            <div className="slider-container">
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
            </div>
            <h2 style={{fontSize:"20px", fontWeight:"500",padding:"0 0 24px 0", margin:"0"}}>Tecnología</h2>
            <div className="slider-container">
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
                <CardCategoria url="https://cdn-icons-png.flaticon.com/512/1040/1040214.png" title="Tecnología" />
            </div>
        </section>
        </>
    );
}