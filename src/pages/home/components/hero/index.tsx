import { Background, Container, Title, Description } from "./_heroStyle";

type HeroProps = {
  description: string | undefined;
  text: string | undefined;
  isAdmin?: boolean;
  isVillage?: boolean;
};

const Hero: React.FC<HeroProps> = ({ description, text, isAdmin = false, isVillage = false }) => {
  return (
    <Background isAdmin={isAdmin} isVillage={isVillage}>
      <Container>
        <Title>Selamat Datang di</Title>
        <Description>
          {description} <br /> {text}
        </Description>
      </Container>
    </Background>
  );
};

export default Hero;
