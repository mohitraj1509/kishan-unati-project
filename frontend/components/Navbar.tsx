import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Kisan Unnati</Link>
        <div className="space-x-4">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/profile" className="hover:underline">Profile</Link>
          <Link href="/voice-assistant" className="hover:underline">Voice Assistant</Link>
        </div>
      </div>
    </nav>
  )
}