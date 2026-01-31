import type { Metadata } from 'next'
import '../styles/globals.css'
import { OnboardingProvider } from '@/contexts/OnboardingContext'
import OnboardingWrapper from '@/components/OnboardingWrapper'

export const metadata: Metadata = {
  title: 'Kisan Unnati',
  description: 'Empowering farmers with AI-driven insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <OnboardingProvider>
          <OnboardingWrapper />
          {children}
        </OnboardingProvider>
      </body>
    </html>
  )
}