export type MarginProps = {
  mx?: number
  my?: number
  ml?: number
  mr?: number
  mt?: number
  mb?: number
}

export const marginStyle = (props: MarginProps) => {
  let styles = ''
  const { mx, my, ml, mr, mt, mb } = props

  if (mx) {
    styles += `
        margin-left: ${mx}px; 
        margin-right: ${mx}px;
    `
  }

  if (my) {
    styles += `
        margin-top: ${my}px;
        margin-bottom: ${my}px;
    `
  }

  if (ml) {
    styles += `
        margin-left: ${ml}px;
    `
  }

  if (mr) {
    styles += `
        margin-right: ${mr}px;    
    `
  }

  if (mt) {
    styles += `
        margin-top: ${mt}px;
    `
  }

  if (mb) {
    styles += `
        margin-bottom: ${mb}px;
    `
  }

  return styles
}

export type PaddingProps = {
  px?: number
  py?: number
  pl?: number
  pr?: number
  pt?: number
  pb?: number
}

export const paddingStyle = (props: PaddingProps) => {
  let styles = ''
  const { px, py, pl, pr, pt, pb } = props

  if (px) {
    styles += `
        padding-left: ${px}px; 
        padding-right: ${px}px;
    `
  }

  if (py) {
    styles += `
        padding-top: ${py}px;
        padding-bottom: ${py}px;
    `
  }

  if (pl) {
    styles += `
        padding-left: ${pl}px;
    `
  }

  if (pr) {
    styles += `
        padding-right: ${pr}px;    
    `
  }

  if (pt) {
    styles += `
        padding-top: ${pt}px;
    `
  }

  if (pb) {
    styles += `
        padding-bottom: ${pb}px;
    `
  }

  return styles
}
