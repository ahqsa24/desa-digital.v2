import { Background, Container, Title, Description } from "./_heroStyle";

type HeroProps = {
  description: string | undefined;
  text: string | undefined;
  isAdmin?: boolean;
};

const Hero: React.FC<HeroProps> = ({ description, text, isAdmin = false }) => {
  return (
    <Background isAdmin={isAdmin}>
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
