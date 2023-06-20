import Container from 'Components/container'
import { Background, Text } from './_readinessStyle'
import Button from 'Components/button'

function Readiness() {
  const onClickHere = () => {
    window.open('https://www.google.com', '_blank')
  }

  return (
    <Container>
      <Background>
        <Text>
          Cek Kesiapan Dirimu <br /> terhadap Desa Digital
        </Text>
        <Button size='s' onClick={onClickHere}>
          Disini
        </Button>
      </Background>
    </Container>
  )
}

export default Readiness
