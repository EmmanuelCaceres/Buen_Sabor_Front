

interface LabelPublicProps {
    text: string;
}

export const LabelPublic = ({ text }: LabelPublicProps) => {
    return (
        <h2 style={{fontSize:"20px",fontWeight:"600",color:"rgb(16,4,35)"}}>{text}</h2>
    );
}