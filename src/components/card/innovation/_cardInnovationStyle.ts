import styled from 'styled-components'

export const Container = styled.div`
  border: 1px solid #e5e7eb;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 156px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
`

export const Background = styled.img`
height: 100px;
flex-shrink: 0;
align-self: stretch;
object-fit: cover;
`

export const Content = styled.div`
display: flex;
padding: 8px;
flex-direction: column;
justify-content: space-between;
height: 100%;
flex: 1 0 0;
`

export const Title = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: #1A20c;
  white-space: wrap;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  align-self: stretch;
  text-overflow: ellipsis;
`

export const Category = styled.p`
  font-size: 10px;
  font-weight: 400;
  color: #374151;
  margin: 4px 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  align-self: stretch;
  text-overflow: ellipsis;
`

export const Description = styled.p`
  font-size: 10px;
  font-weight: 400;
  color: #9ca3af;
  text-overflow: ellipsis;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3; /* Limit the content to three lines */
  -webkit-box-orient: vertical;
  white-space: wrap;
  
`

export const Icon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
`
export const Company = styled.p`
  font-size: 10px;
  font-weight: 600;
  color: #4b5563;
  
`

export const Applied = styled.p`
  margin-top: 4px;
  font-size: 10px;
  font-weight: 400;
  color: #4b5563;
`
export const CompanyContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
export const InnovatorName = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: #4B5563; // Adjust color as needed
  margin-left: 2px;
  align-self: center; // Adjust alignment as needed
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  white-space: wrap;
`;