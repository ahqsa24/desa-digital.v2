import { StyledKlaimBadge } from './_klaimBadgeStyle'
import { MarginProps } from 'Consts/sizing'

interface KlaimBadgeProps extends MarginProps {
    condition?: 'menunggu' | 'terverifikasi' | 'ditolak'}

function KlaimBadge(props: KlaimBadgeProps) {
      // Tentukan teks sesuai dengan kondisi
  let badgeText = 'Status Tidak Diketahui'; // Default text
  
  if (props.condition === 'menunggu') {
    badgeText = 'Menunggu';
  } else if (props.condition === 'terverifikasi') {
    badgeText = 'Terverifikasi';
  } else if (props.condition === 'ditolak') {
    badgeText = 'Ditolak';
  }
    return <StyledKlaimBadge {...props}>{badgeText}</StyledKlaimBadge>
}

export default KlaimBadge
