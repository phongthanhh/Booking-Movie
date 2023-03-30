import HomeFilm from 'components/HomeFilm/HomeFilm'
import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Tabs } from 'antd'
import { Autoplay, Pagination, Navigation } from 'swiper'
import { SwiperTab } from './SwipeCSS'

const SWIPER_TABS = {
  SHOWING: 'showing',
  UPCOMING: 'upcoming'
}

function SwiperCarousel() {
  const { moviesShowing, moviesUpComing } = useSelector((state) => state.movieManagerReducer)
  const [currentTab, setCurrentTab] = useState(SWIPER_TABS.SHOWING)

  const renderFilms = useMemo(() => {
    const filmsToShow = currentTab === SWIPER_TABS.SHOWING ? moviesShowing : moviesUpComing
    return filmsToShow.map((film) => (
      <SwiperSlide>
        <HomeFilm film={film} />
      </SwiperSlide>
    ))
  }, [moviesShowing, moviesUpComing, currentTab])

  const items = [
    {
      key: '1',
      label: (
        <button
          type="button"
          onClick={() => setCurrentTab(SWIPER_TABS.SHOWING)}
          className="btn__show text-white"
        >
          Đang Chiếu
        </button>)
    },
    {
      key: '2',
      label: (
        <button
          type="button"
          onClick={() => setCurrentTab(SWIPER_TABS.UPCOMING)}
          className="btn__show text-white"
        >
          Sắp Chiếu
        </button>)
    }
  ]

  return (
    <SwiperTab className="container py-5">
      <Tabs defaultActiveKey="1" items={items} />
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false
        }}
        pagination={{
          el: '.swiper-pagination',
          clickable: true
        }}
        navigation
        spaceBetween={15}
        slidesPerView={4}
        slidesPerColumnFill="row"
        onSwiper={(swiper) => console.log(swiper)}
      >
        {renderFilms}
      </Swiper>
    </SwiperTab>
  )
}

export default SwiperCarousel
