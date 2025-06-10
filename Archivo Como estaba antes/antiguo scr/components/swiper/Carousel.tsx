// components/ServicesCarousel.tsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { useTranslations } from 'next-intl';

export default function Carousel() {
  const t = useTranslations('ServicesSection');

  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      spaceBetween={16}
      slidesPerView={1}
      loop={true}
      className="w-full"
    >
      {Array(3).fill(0).map((_, index) => (
        <SwiperSlide key={index}>
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h4 className="text-xl font-semibold mb-2">
              {t(`service${index + 1}`)}
            </h4>
            <p className="text-gray-600">{t(`serviceDescription${index + 1}`)}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
