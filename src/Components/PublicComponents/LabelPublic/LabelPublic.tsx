import "./LabelPublic.css"

interface LabelPublicProps {
    text: string;
}

export const LabelPublic = ({ text }: LabelPublicProps) => {
    return (
        <h2 className="label-public">{text}</h2>
    );
}