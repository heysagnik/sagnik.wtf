import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold">
          yourname.dev
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/work" className="text-sm font-medium">
            Work
          </Link>
          <Link href="/about" className="text-sm font-medium">
            About
          </Link>
          <Button variant="secondary" asChild>
            <Link href="/contact">Get in touch</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

