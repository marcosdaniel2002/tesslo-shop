"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperObject } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import "./slideshow.css";
// import required modules
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper/modules";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

function ProductSlide({ images, title, className }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();
  return (
    <div className={className}>
      {/* IMAGEN GRANDE */}
      <Swiper
        // style={
        //   {
        //     "--swiper-navigation-color": "#fff",
        //     "--swiper-pagination-color": "#fff",
        //   } as React.CSSProperties
        // }
        spaceBetween={10}
        navigation={true}
        autoplay={{
          delay: 2500,
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2 bg-gray-300 rounded-md !h-min"
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <div className="relative w-full h-[450px] md:h-[800px]">
              <Image
                fill
                src={`/products/${image}`}
                alt={title}
                className="rounded-lg !object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* IMAGENES PEQUEÑAS ABAJO */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <Image
              width={200}
              height={200}
              src={`/products/${image}`}
              alt={title}
              objectFit="contain"
              className="rounded-lg !object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductSlide;
