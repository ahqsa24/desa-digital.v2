import React, { useEffect, useState } from 'react'
import { paths } from 'Consts/path'
import TopBar from 'Components/topBar'
import Container from 'Components/container'
import CardCategory from 'Components/cardCategory'
import { useNavigate, useParams, generatePath } from 'react-router-dom'
import CardInnovation from 'Components/cardInnovation'
import { Container as CategoryContainer, DetailContainer } from './_categoryStyle'
import Encomotion from 'Assets/images/encomotion.jpg'
import SmartGreenHouse from 'Assets/images/smart-green-house.jpg'
import Efeeder from 'Assets/images/efishery.jpg'
import EFishery from 'Assets/images/efishery-logo.jpg'
import Biops from 'Assets/images/biops-logo.jpg'
import Alittifaq from 'Assets/images/alittifaq-logo.jpg'
import Jala from 'Assets/images/jala.jpg'
import Fishgo from 'Assets/images/fishgo.jpg'
import { useQuery } from 'react-query'
import { getCategories } from 'Services/category'
import Loading from 'Components/loading'

function Detail() {
  const navigate = useNavigate()

  const data = [
    {
      background: Efeeder,
      icon: EFishery,
      title: 'Efeeder',
      category: 'smart-agriculture',
      description: `Pakan otomatis cerdas yang dapat dikontrol melalui telepon`,
      companyName: 'eFishery',
      appliedInnovation: 1,
    },
    {
      background: Encomotion,
      icon: Biops,
      title: 'Encomotion',
      category: 'smart-agriculture',
      description: `Pemaksimalan hasil pertanian untuk teknik budidaya dengan sistem green house atau rumah kaca.`,
      companyName: 'BIOPS AGROTEKNO',
      appliedInnovation: 1,
    },
    {
      background: SmartGreenHouse,
      icon: Alittifaq,
      title: 'Smart Greenhouse dengan IoT',
      category: 'smart-agriculture',
      description: `Budidaya dan pemasok sayuran dataran tinggi dengan pola tanam sesuai permintaan pasar, baik dalam green house dengan IoT, precision farming maupun open field secara tradisional.`,
      companyName: 'Kopontren AlIttifaq',
      appliedInnovation: 1,
    },
    {
      background: Jala,
      icon: Fishgo,
      title: 'JALA APP',
      category: 'smart-agriculture',
      description: `Mencatat, memantau, dan menganalisis setiap progress tambak secara real-time untuk mengambil langkah terbaik dalam budidaya udang, semua dalam genggaman Anda.`,
      companyName: `Fishgo`,
      appliedInnovation: 1,
    },
  ]

  return (
    <DetailContainer>
      {data.map((item, idx) => (
        <CardInnovation key={idx} {...item} onClick={() => navigate(paths.DETAIL_INNOVATION_PAGE)} />
      ))}
    </DetailContainer>
  )
}

type ListProps = {
  data: any
  isFetched: boolean
  isLoading: boolean
}

function List(props: ListProps) {
  const { data, isFetched, isLoading } = props

  const navigate = useNavigate()
  const [menu, setMenu] = useState<any>([])

  const handleClick = (category: string) => {
    const path = generatePath(paths.INNOVATION_CATEGORY_PAGE, {
      category: category,
    })
    navigate(path)
  }

  useEffect(() => {
    if (isFetched) {
      const temp = [...data?.slice(0, data?.length - 1)]
      setMenu(temp)
    }
  }, [isFetched])

  return (
    <React.Fragment>
      {isLoading && <Loading fullHeight />}
      {isFetched &&
        menu.map((item: any, idx: number) => (
          <CardCategory {...item} key={idx} onClick={() => handleClick(item.category)} />
        ))}
    </React.Fragment>
  )
}

function Category() {
  const navigate = useNavigate()
  const { category } = useParams()

  const { data, isFetched, isLoading } = useQuery('category', getCategories)
  const title = isFetched ? data?.find((item: any) => item.category === category)?.title : 'Kategori Inovasi'

  const listProps = {
    data,
    isFetched,
    isLoading,
  }

  return (
    <Container page>
      <TopBar title={title || 'Kategori Inovasi'} onBack={() => navigate(-1)} />
      <CategoryContainer>
        {category && <Detail />}
        {!category && <List {...listProps} />}
      </CategoryContainer>
    </Container>
  )
}

export default Category
