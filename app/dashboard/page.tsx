"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Phone, 
  Building, 
  User, 
  Users, 
  GraduationCap, 
  Bell, 
  UserPlus, 
  LogOut,
  Calendar,
  TrendingUp,
  Activity,
  Award
} from "lucide-react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

interface DashboardStats {
  totalCarreras: number
  totalUsuarios: number
  totalGrupos: number
  totalInvitaciones: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalCarreras: 0,
    totalUsuarios: 0,
    totalGrupos: 0,
    totalInvitaciones: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    loadDashboardStats()
  }, [isAuthenticated, router])

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true)
      
      // Load statistics from API
      const [carrerasRes, usuariosRes, gruposRes, invitacionesRes] = await Promise.all([
        apiClient.getCarreras(),
        apiClient.getUsuarios({ limit: 1 }),
        apiClient.getGrupos({ limit: 1 }),
        apiClient.getInvitaciones({ limit: 1 })
      ])

      setStats({
        totalCarreras: carrerasRes.success ? carrerasRes.data?.length || 0 : 0,
        totalUsuarios: usuariosRes.success ? usuariosRes.pagination?.total || 0 : 0,
        totalGrupos: gruposRes.success ? gruposRes.pagination?.total || 0 : 0,
        totalInvitaciones: invitacionesRes.success ? invitacionesRes.pagination?.total || 0 : 0
      })
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      toast.error('Error al cargar estadísticas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Sesión cerrada exitosamente')
      router.push("/login")
    } catch (error) {
      console.error('Error en logout:', error)
      toast.error('Error al cerrar sesión')
    }
  }

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800 border-red-200",
      profesor: "bg-blue-100 text-blue-800 border-blue-200",
      estudiante: "bg-green-100 text-green-800 border-green-200",
      oficina: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-green-500 to-green-600 text-white flex flex-col">
        <div className="p-4 border-b border-green-400">
          <h2 className="text-lg font-semibold">Agenda UML</h2>
          <p className="text-sm text-green-100">Panel de Control</p>
        </div>

        <nav className="flex-1 p-2">
          <Link
            href="/dashboard"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 bg-white/20 text-white font-medium"
          >
            <Activity className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/agenda"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 text-green-100 hover:bg-white/10 hover:text-white"
          >
            <Phone className="w-4 h-4" />
            Agenda telefónica
          </Link>
          <Link
            href="/usuarios"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 text-green-100 hover:bg-white/10 hover:text-white"
          >
            <Users className="w-4 h-4" />
            Usuarios
          </Link>
          <Link
            href="/grupos"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 text-green-100 hover:bg-white/10 hover:text-white"
          >
            <Building className="w-4 h-4" />
            Grupos
          </Link>
          <Link
            href="/carreras"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 text-green-100 hover:bg-white/10 hover:text-white"
          >
            <GraduationCap className="w-4 h-4" />
            Carreras
          </Link>
          <Link
            href="/perfil"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 text-green-100 hover:bg-white/10 hover:text-white"
          >
            <User className="w-4 h-4" />
            Perfil
          </Link>
          <Link
            href="/notificaciones"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 text-green-100 hover:bg-white/10 hover:text-white"
          >
            <Bell className="w-4 h-4" />
            Notificaciones
            <Badge className="bg-red-500 text-white text-xs ml-auto">3</Badge>
          </Link>
          <Link
            href="/invitaciones"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 text-green-100 hover:bg-white/10 hover:text-white"
          >
            <UserPlus className="w-4 h-4" />
            Invitaciones
          </Link>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-green-400">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.nombres} {user?.apellidos}
              </p>
              <p className="text-xs text-green-100 truncate">{user?.correo}</p>
            </div>
          </div>
          <Badge className={`${getRoleColor(user?.rol || '')} text-xs w-full justify-center`}>
            {user?.rol?.toUpperCase() || 'USUARIO'}
          </Badge>
        </div>

        {/* Logout Button */}
        <div className="p-2 border-t border-green-400">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-green-100 hover:bg-red-500/20 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Bienvenido al sistema de gestión de la Universidad Martin Lutero</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      ¡Bienvenido, {user?.nombres}!
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Gestiona eficientemente la agenda telefónica, carreras, grupos y usuarios de la Universidad Martin Lutero.
                    </p>
                    <div className="flex gap-3">
                      <Link href="/carreras">
                        <Button size="sm">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          Gestionar Carreras
                        </Button>
                      </Link>
                      <Link href="/usuarios">
                        <Button variant="outline" size="sm">
                          <Users className="w-4 h-4 mr-2" />
                          Ver Usuarios
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <Award className="w-16 h-16 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Carreras</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : stats.totalCarreras}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Carreras activas en el sistema
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : stats.totalUsuarios}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Estudiantes y docentes registrados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Grupos</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : stats.totalGrupos}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Grupos de estudio creados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Invitaciones</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : stats.totalInvitaciones}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Invitaciones pendientes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Acciones Rápidas
                  </CardTitle>
                  <CardDescription>
                    Accede rápidamente a las funciones más utilizadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/carreras">
                      <Button variant="outline" className="w-full justify-start">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Carreras
                      </Button>
                    </Link>
                    <Link href="/usuarios">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Usuarios
                      </Button>
                    </Link>
                    <Link href="/grupos">
                      <Button variant="outline" className="w-full justify-start">
                        <Building className="w-4 h-4 mr-2" />
                        Grupos
                      </Button>
                    </Link>
                    <Link href="/invitaciones">
                      <Button variant="outline" className="w-full justify-start">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invitaciones
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Actividad Reciente
                  </CardTitle>
                  <CardDescription>
                    Últimas actividades en el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Sesión iniciada exitosamente</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Dashboard cargado</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-gray-400">Esperando actividad...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 