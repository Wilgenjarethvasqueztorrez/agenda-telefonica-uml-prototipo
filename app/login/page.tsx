"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, GraduationCap, Shield, Users, Phone } from "lucide-react"
import { toast } from "sonner"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, options: any) => void
          prompt: () => void
        }
      }
    }
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated && !isLoading) {
      router.replace("/dashboard")
      return
    }

    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
        auto_select: true,
        cancel_on_tap_outside: true,
      })

      // Render the Google Sign-In button
      const buttonElement = document.getElementById("google-signin-button")
      if (buttonElement) {
        window.google.accounts.id.renderButton(buttonElement, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: 280,
        })
      }
    }
  }, [isAuthenticated, isLoading, router])

  const handleGoogleSignIn = async (response: any) => {
    try {
      setIsGoogleLoading(true)
      setError(null)

      // Get the ID token from the response
      const idToken = response.credential

      // Verify the email domain before proceeding
      const payload = JSON.parse(atob(idToken.split('.')[1]))
      const email = payload.email

      if (!email.endsWith('@uml.edu.ni')) {
        setError('Solo se permiten correos electrónicos de la Universidad Martin Lutero (@uml.edu.ni)')
        toast.error('Correo no autorizado')
        return
      }

      // Proceed with login
      await login(idToken)
      toast.success('Inicio de sesión exitoso')
      
      // Use replace instead of push to avoid back button issues
      router.replace("/dashboard")
    } catch (error) {
      console.error('Error en login:', error)
      setError('Error al iniciar sesión. Por favor, intenta de nuevo.')
      toast.error('Error en el inicio de sesión')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleManualGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-12 h-12 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Agenda UML</h1>
          </div>
          <p className="text-gray-600">Universidad Martin Lutero</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-gray-600">
              Accede a tu cuenta con tu correo institucional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Domain Restriction Notice */}
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Restricción:</strong> Solo se permiten correos electrónicos de la Universidad Martin Lutero (@uml.edu.ni)
              </AlertDescription>
            </Alert>

            {/* Error Message */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Google Sign-In Button */}
            <div className="space-y-4">
              <div id="google-signin-button" className="flex justify-center"></div>
              
              {/* Fallback Button */}
              <Button
                onClick={handleManualGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full h-12 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                variant="outline"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continuar con Google
              </Button>
            </div>

            {/* Features */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                ¿Qué puedes hacer?
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-green-600" />
                  Gestionar agenda telefónica
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-green-600" />
                  Crear y administrar grupos
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4 mr-2 text-green-600" />
                  Gestionar carreras y estudiantes
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4">
              <p className="text-xs text-gray-500">
                Al continuar, aceptas nuestros términos de servicio y política de privacidad
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿Problemas para acceder?{" "}
            <a href="mailto:soporte@uml.edu.ni" className="text-green-600 hover:text-green-700 font-medium">
              Contacta soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 