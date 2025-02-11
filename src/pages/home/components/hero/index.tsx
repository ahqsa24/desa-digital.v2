import { Background, Container, Title, Description } from "./_heroStyle";

type HeroProps = {
  description: string | undefined;
  text: string | undefined;
  isAdmin?: boolean;
  isInnovator?: boolean;
  isVillage?: boolean;
};

const Hero: React.FC<HeroProps> = ({ description, text, isAdmin = false, isInnovator = false, isVillage = false }) => {
  return (
    <Background isAdmin={isAdmin} isInnovator={isInnovator} isVillage={isVillage}>
      <Container>
        <Title color="#1A202C">Selamat Datang di</Title>
        <Description color="#1A202C">
          {description} <br /> {text}
        </Description>
      </Container>
    </Background>
  );
};

export default Hero;
