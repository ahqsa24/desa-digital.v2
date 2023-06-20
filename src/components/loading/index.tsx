import { LoadingContainer, LoadingSpinner } from './_loading'

type LoadingProps = {
  fullHeight?: boolean
}

function Loading(props: LoadingProps) {
  return (
    <LoadingContainer {...props}>
      <LoadingSpinner />
    </LoadingContainer>
  )
}

export default Loading
