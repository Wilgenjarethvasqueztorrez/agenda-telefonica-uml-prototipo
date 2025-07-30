"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Phone, Building, User, Users, GraduationCap, Bell, UserPlus, LogOut, Award, Search, Edit, Trash2, MoreHorizontal, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient, Carrera } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export default function CareersPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const [carreras, setCarreras] = useState<Carrera[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCarrera, setEditingCarrera] = useState<Carrera | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
  })

  // Cargar carreras al montar el componente
  useEffect(() => {
    loadCarreras()
  }, [])

  const loadCarreras = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getCarreras()
      if (response.success && response.data) {
        setCarreras(response.data)
      }
    } catch (error) {
      console.error('Error cargando carreras:', error)
      toast.error('Error al cargar las carreras')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCarreras = carreras.filter((carrera) => {
    const matchesSearch =
      carrera.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrera.codigo.toString().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCarrera) {
        const response = await apiClient.updateCarrera(editingCarrera.id, {
          nombre: formData.nombre,
          codigo: parseInt(formData.codigo)
        })
        
        if (response.success) {
          toast.success('Carrera actualizada exitosamente')
          loadCarreras()
        }
      } else {
        const response = await apiClient.createCarrera({
          nombre: formData.nombre,
          codigo: parseInt(formData.codigo)
        })
        
        if (response.success) {
          toast.success('Carrera creada exitosamente')
          loadCarreras()
        }
      }

      resetForm()
    } catch (error) {
      console.error('Error guardando carrera:', error)
      toast.error('Error al guardar la carrera')
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      codigo: "",
    })
    setEditingCarrera(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (carrera: Carrera) => {
    setEditingCarrera(carrera)
    setFormData({
      nombre: carrera.nombre,
      codigo: carrera.codigo.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta carrera?')) {
      return
    }

    try {
      const response = await apiClient.deleteCarrera(id)
      if (response.success) {
        toast.success('Carrera eliminada exitosamente')
        loadCarreras()
      }
    } catch (error) {
      console.error('Error eliminando carrera:', error)
      toast.error('Error al eliminar la carrera')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Sesión cerrada exitosamente')
    } catch (error) {
      console.error('Error en logout:', error)
      toast.error('Error al cerrar sesión')
    }
  }

  // Calcular estadísticas
  const totalCarreras = carreras.length
  const totalEstudiantes = carreras.reduce((sum, carrera) => sum + (carrera.usuarios?.length || 0), 0)

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">Debes iniciar sesión para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-green-500 to-green-600 text-white flex flex-col">
        <div className="p-4 border-b border-green-400">
          <h2 className="text-lg font-semibold">Agenda UML</h2>
        </div>

        <nav className="flex-1 p-2">
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 bg-white/20 text-white font-medium"
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
            Notificación
            <Badge className="bg-red-500 text-white text-xs ml-auto">3</Badge>
          </Link>
          <Link
            href="/invitaciones"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 text-green-100 hover:bg-white/10 hover:text-white"
          >
            <UserPlus className="w-4 h-4" />
            Invitación
          </Link>
        </nav>

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
              <h1 className="text-2xl font-bold text-gray-900">Carreras</h1>
              <p className="text-sm text-gray-600">Gestiona las carreras de la universidad</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <Award className="w-4 h-4" />
                  <span className="font-medium">{totalCarreras}</span>
                  <span className="text-gray-500">carreras</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{totalEstudiantes}</span>
                  <span className="text-gray-500">estudiantes</span>
                </div>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingCarrera(null)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Carrera
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingCarrera ? "Editar Carrera" : "Crear Nueva Carrera"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="nombre">Nombre de la Carrera</Label>
                      <Input
                        id="nombre"
                        placeholder="ej. Ingeniería en Sistemas"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="codigo">Código</Label>
                      <Input
                        id="codigo"
                        type="number"
                        placeholder="ej. 001"
                        value={formData.codigo}
                        onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button type="submit" className="flex-1">
                        {editingCarrera ? "Actualizar Carrera" : "Crear Carrera"}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando carreras...</p>
              </div>
            ) : (
              <>
                {/* Carreras Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCarreras.map((carrera) => (
                    <Card key={carrera.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                              {carrera.nombre}
                            </CardTitle>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                Código: {carrera.codigo}
                              </Badge>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(carrera)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(carrera.id)} className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">{carrera.usuarios?.length || 0}</span>
                            <span>estudiantes</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Empty State */}
                {filteredCarreras.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron carreras</h3>
                    <p className="text-gray-600">
                      {searchTerm ? 'Intenta ajustar los filtros de búsqueda' : 'Crea una nueva carrera para comenzar'}
                    </p>
                  </div>
                )}

                {/* Results Counter */}
                <div className="mt-4 text-sm text-gray-600">
                  Mostrando {filteredCarreras.length} de {carreras.length} carreras
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
