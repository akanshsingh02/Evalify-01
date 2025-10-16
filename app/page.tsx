import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import HeroScreens from "@/components/hero-screens" // Import the new component

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4">
        {/* Enhanced hero with image, animations, and stronger CTA */}
        <section className="relative overflow-hidden py-16">
          {/* Animated background blobs */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="blob absolute -top-10 left-10 h-48 w-48 rounded-full bg-primary/30" />
            <div className="blob absolute bottom-0 right-24 h-56 w-56 rounded-full bg-secondary/30 [animation-delay:400ms]" />
          </div>
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-0 md:grid-cols-2">
            <div className="text-center md:text-left">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground md:mx-0">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                New: Role-based dashboards
              </div>
              <h1 className="animate-fade-in-up gradient-text text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                AI-Powered Evaluation System
              </h1>
              <p className="animate-fade-in-up mt-4 text-pretty text-muted-foreground [animation-delay:120ms]">
                Real-time grading • Instant feedback • Transparent results.
              </p>
              <div className="animate-fade-in-up mt-6 flex items-center justify-center gap-3 md:justify-start [animation-delay:200ms]">
                <Link href="/register">
                  <Button size="lg" className="hover-lift shimmer">
                    Get Started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="hover-lift bg-transparent">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-first md:order-none">
              <img
                src="/students-in-classroom-using-laptops.jpg"
                alt="Students using Evalify in a classroom"
                className="mx-auto h-auto w-full max-w-[560px] rounded-lg border animate-float shimmer"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Add screenshots carousel to showcase UI */}
        <section className="relative py-10">
          {/* Animated gradient band */}
          <div aria-hidden className="animated-gradient absolute inset-x-0 top-0 -z-10 h-40 w-full opacity-30 blur-2xl" />
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 text-center">
              <p className="text-sm text-muted-foreground">Preview the interface</p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <HeroScreens /> {/* Using the new HeroScreens component */}
          </div>
        </section>

        <section id="features" className="grid gap-4 py-8 md:grid-cols-4">
          {[
            { title: "Auto Grading", desc: "Immediate scoring with explainability.", delay: " [animation-delay:40ms]" },
            { title: "Feedback", desc: "Actionable insights to improve answers.", delay: " [animation-delay:80ms]" },
            { title: "Analytics", desc: "Track progress with rich visuals.", delay: " [animation-delay:120ms]" },
            { title: "Security", desc: "Role-based access and auditability.", delay: " [animation-delay:160ms]" },
          ].map((f) => (
            <Card key={f.title} className={`border animate-fade-in-up${f.delay}`}>
              <CardContent className="p-4">
                <div className="h-8 w-8 rounded-md bg-secondary" aria-hidden="true" />
                <h3 className="mt-3 font-medium">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section id="why" className="py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="animate-fade-in-up">
              <CardContent className="p-6">
                <h3 className="font-medium">Transparent</h3>
                <p className="mt-2 text-sm text-muted-foreground">See exactly how scores are derived.</p>
              </CardContent>
            </Card>
            <Card className="animate-fade-in-up [animation-delay:120ms]">
              <CardContent className="p-6">
                <h3 className="font-medium">Scalable</h3>
                <p className="mt-2 text-sm text-muted-foreground">Built for institutions of any size.</p>
              </CardContent>
            </Card>
            <Card className="animate-fade-in-up [animation-delay:200ms]">
              <CardContent className="p-6">
                <h3 className="font-medium">Accessible</h3>
                <p className="mt-2 text-sm text-muted-foreground">Keyboard-friendly and screen-reader ready.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="faq" className="py-12">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-3">
            <details className="rounded-md border p-4">
              <summary className="cursor-pointer font-medium">Is this a frontend-only demo?</summary>
              <p className="mt-2 text-sm text-muted-foreground">Yes. All data is mocked with no backend required.</p>
            </details>
            <details className="rounded-md border p-4">
              <summary className="cursor-pointer font-medium">Can roles be simulated?</summary>
              <p className="mt-2 text-sm text-muted-foreground">
                Use the role links and dashboard routes to preview layouts.
              </p>
            </details>
          </div>
        </section>

        <section id="contact" className="py-12">
          <Card>
            <CardContent className="flex items-center justify-between gap-4 p-6">
              <div>
                <h3 className="font-medium">Ready to evaluate smarter?</h3>
                <p className="text-sm text-muted-foreground">Create an account and explore role-based dashboards.</p>
              </div>
              <Link href="/register">
                <Button>Create Account</Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="mt-12 border-t py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Evalify</p>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#features">Features</a>
            <a href="#why">Why Us</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
      </footer>
    </>
  )
}
