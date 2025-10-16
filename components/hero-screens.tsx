"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export function HeroScreens() {
  const slides = [
    {
      src: "/evalify-dashboard-analytics.jpg",
      alt: "Evalify dashboard analytics preview",
    },
    {
      src: "/evalify-student-submissions.jpg",
      alt: "Evalify student submissions list preview",
    },
    {
      src: "/evalify-report-details.jpg",
      alt: "Evalify report details preview",
    },
  ]
  return (
    <div className="relative">
      <Carousel className="mx-auto max-w-3xl">
        <CarouselContent className="items-stretch">
          {slides.map((s, i) => (
            <CarouselItem key={i} className="basis-full">
              <div className="rounded-lg border bg-card p-2 hover-lift">
                <img
                  src={s.src || "/placeholder.svg"}
                  alt={s.alt}
                  className="h-auto w-full rounded-md"
                  loading="lazy"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default HeroScreens
