import type { Metadata } from 'next'
import '../styles/globals.css'
import '../styles/dark-mode.css'
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body>
        <OnboardingProvider>
          <OnboardingWrapper />
          {children}
        </OnboardingProvider>
      </body>
    </html>
  )
}