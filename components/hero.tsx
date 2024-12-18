import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative py-20 text-center">
      {/* Decorative elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-64 w-64">
          <div className="absolute -left-16 -top-16 h-12 w-12 rounded-lg border-2 border-purple-200"></div>
          <div className="absolute -right-8 top-0 h-8 w-8 rounded-full bg-blue-100"></div>
          <div className="absolute -left-8 bottom-0 text-2xl">⭐️</div>
          <div className="absolute -right-16 -bottom-8 text-2xl">❤️</div>
          {/* Avatar */}
          <div className="relative h-full w-full">
            <Image
              src="/placeholder.svg"
              alt="Avatar"
              width={200}
              height={200}
              className="mx-auto rounded-full"
              priority
            />
          </div>
        </div>
      </div>
      
      {/* Text content */}
      <div className="relative mt-64">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Think. Design.
          <br />
          Simplify. Repeat.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Hi I'm Jane. UX/UI Designer and Framer developer based in Wonderland. 
          Check out some of my work below.
        </p>
      </div>
    </section>
  )
}

