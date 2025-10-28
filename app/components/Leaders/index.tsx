"use client"
import Slider from "react-slick";
import React, { Component } from "react";
import Image from "next/image";

// CAROUSEL DATA

interface LeaderProps {
    data: 
    {
        guid: string;
        name: string;
        post: string;
        committee: string;
        photo: string;
        contact: string;       
    }[];
}


// CAROUSEL SETTINGS
const settings = {
            dots: false,
            infinite: true,
            slidesToShow: 5,
            // centerMode: true,
            slidesToScroll: 1,
            arrows: false,
            autoplay: true,
            speed: 4000,
            autoplaySpeed: 2000,
            cssEase: "linear",
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 450,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                }
            ]
        };

export default function Leaders({ data }: LeaderProps) {
    console.log('Leadrs received data:', data);
        return (
            <div className="bg-wework py-32">

                <div className='mx-auto max-w-2xl lg:max-w-7xl sm:py-4 lg:px-8 '>

                    <div className="text-center">
                        <h3 className="text-4xl sm:text-6xl font-bold text-black my-2">Muslim Youth League Leaders</h3>
                        <h3 className="text-4xl sm:text-6xl font-bold text-iuml-green opacity-50 lg:mr-48 my-2">National Committee</h3>
                        <h3 className="text-4xl sm:text-6xl font-bold text-iuml-blue opacity-25 lg:-mr-32 my-2">State Committee</h3>
                    </div>

                </div>

                <Slider {...settings}>
                    {data.map((items, i) => (
                        <div key={i}>
                            <div className='bg-white m-3 py-14 my-10 text-center shadow-xl rounded-3xl'>
                                <div className='relative'>
                                    <Image src={items.photo} alt={items.name || items.post} width={182} height={182} className="inline-block m-auto" />
                                    <Image src={'/images/leaders/linkedin.svg'} alt="greenbg" width={120} height={120} className=" absolute inline-block position-linkedin" />
                                </div>
                                <h4 className='text-3xl font-bold pt-10'>{items.name}</h4>
                                <h3 className='text-2xl font-normal pt-4 pb-2 opacity-80'>{items.post}</h3>
                                <h2 className='text-2xl font-normal pt-4 pb-2 opacity-60'>{items.contact}</h2>
                            </div>
                        </div>
                    ))}
                </Slider>

            </div>

        );
    }

