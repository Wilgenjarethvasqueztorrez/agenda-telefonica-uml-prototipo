"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Plus, Phone, Building, User, Users, GraduationCap, Bell, UserPlus, LogOut, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface CareerSection {
  id: number
  careerName: string
  year: string
  code: string
  faculty: string
  trimesterTeachers: string[]
  studentCount: number
  accreditationDate: string
  description: string
}

const initialCareerSections: CareerSection[] = [
  // Ing. en Sistemas
  {
    id: 1,
    careerName: "Ing. en Sistemas",
    year: "1er",
    code: "IS-001-1",
    faculty: "Ingeniería",
    trimesterTeachers: ["Dr. María González", "Ing. Carlos Mendoza", "Lic. Ana Ruiz"],
    studentCount: 65,
    accreditationDate: "2020-03-15",
    description: "Fundamentos de programación y matemáticas básicas",
  },
  {
    id: 2,
    careerName: "Ing. en Sistemas",
    year: "2do",
    code: "IS-001-2",
    faculty: "Ingeniería",
    trimesterTeachers: ["Ing. Roberto Silva", "Dr. Carmen López", "Lic. Fernando Torres"],
    studentCount: 58,
    accreditationDate: "2020-03-15",
    description: "Estructuras de datos y programación orientada a objetos",
  },
  {
    id: 3,
    careerName: "Ing. en Sistemas",
    year: "3ro",
    code: "IS-001-3",
    faculty: "Ingeniería",
    trimesterTeachers: ["Dr. Patricia Jiménez", "Ing. Diego Morales", "Lic. Valeria Sánchez"],
    studentCount: 52,
    accreditationDate: "2020-03-15",
    description: "Bases de datos y desarrollo web avanzado",
  },
  {
    id: 4,
    careerName: "Ing. en Sistemas",
    year: "4to",
    code: "IS-001-4",
    faculty: "Ingeniería",
    trimesterTeachers: ["Ing. Andrés Herrera", "Dr. Laura Fernández", "Lic. Miguel Torres"],
    studentCount: 45,
    accreditationDate: "2020-03-15",
    description: "Ingeniería de software y arquitectura de sistemas",
  },
  {
    id: 5,
    careerName: "Ing. en Sistemas",
    year: "5to",
    code: "IS-001-5",
    faculty: "Ingeniería",
    trimesterTeachers: ["Dr. Juan Pérez", "Ing. Sofia Rodríguez", "Lic. Carlos López"],
    studentCount: 25,
    accreditationDate: "2020-03-15",
    description: "Proyecto de graduación y especialización",
  },

  // Administración
  {
    id: 6,
    careerName: "Administración",
    year: "1er",
    code: "AD-002-1",
    faculty: "Ciencias Económicas",
    trimesterTeachers: ["Lic. Roberto Silva", "MBA. Carmen López", "Dr. Fernando Torres"],
    studentCount: 55,
    accreditationDate: "2019-08-20",
    description: "Fundamentos de administración y contabilidad básica",
  },
  {
    id: 7,
    careerName: "Administración",
    year: "2do",
    code: "AD-002-2",
    faculty: "Ciencias Económicas",
    trimesterTeachers: ["Dr. Patricia Jiménez", "Lic. Diego Morales", "MBA. Ana Martínez"],
    studentCount: 48,
    accreditationDate: "2019-08-20",
    description: "Gestión de recursos humanos y marketing",
  },
  {
    id: 8,
    careerName: "Administración",
    year: "3ro",
    code: "AD-002-3",
    faculty: "Ciencias Económicas",
    trimesterTeachers: ["Lic. Valeria Sánchez", "Dr. Andrés Herrera", "MBA. Laura Fernández"],
    studentCount: 42,
    accreditationDate: "2019-08-20",
    description: "Finanzas corporativas y estrategia empresarial",
  },
  {
    id: 9,
    careerName: "Administración",
    year: "4to",
    code: "AD-002-4",
    faculty: "Ciencias Económicas",
    trimesterTeachers: ["Dr. Miguel Torres", "Lic. Juan Pérez", "MBA. Sofia Rodríguez"],
    studentCount: 35,
    accreditationDate: "2019-08-20",
    description: "Gestión de proyectos y liderazgo empresarial",
  },

  // Medicina
  {
    id: 10,
    careerName: "Medicina",
    year: "1er",
    code: "ME-005-1",
    faculty: "Ciencias de la Salud",
    trimesterTeachers: ["Dr. Fernando Mendoza", "Dra. Laura Fernández", "Dr. Miguel Torres"],
    studentCount: 25,
    accreditationDate: "2022-06-30",
    description: "Anatomía y fisiología humana básica",
  },
  {
    id: 11,
    careerName: "Medicina",
    year: "2do",
    code: "ME-005-2",
    faculty: "Ciencias de la Salud",
    trimesterTeachers: ["Dra. Ana Martínez", "Dr. Carlos López", "Dra. Patricia Jiménez"],
    studentCount: 22,
    accreditationDate: "2022-06-30",
    description: "Patología y farmacología básica",
  },
  {
    id: 12,
    careerName: "Medicina",
    year: "3ro",
    code: "ME-005-3",
    faculty: "Ciencias de la Salud",
    trimesterTeachers: ["Dr. Diego Morales", "Dra. Valeria Sánchez", "Dr. Andrés Herrera"],
    studentCount: 20,
    accreditationDate: "2022-06-30",
    description: "Medicina interna y diagnóstico clínico",
  },

  // Derecho
  {
    id: 13,
    careerName: "Derecho",
    year: "1er",
    code: "DE-008-1",
    faculty: "Ciencias Jurídicas",
    trimesterTeachers: ["Dr. Diego Morales", "Lic. Carlos López", "Abg. Ana Martínez"],
    studentCount: 35,
    accreditationDate: "2019-12-05",
    description: "Introducción al derecho y derecho constitucional",
  },
  {
    id: 14,
    careerName: "Derecho",
    year: "2do",
    code: "DE-008-2",
    faculty: "Ciencias Jurídicas",
    trimesterTeachers: ["Abg. Patricia Jiménez", "Dr. Fernando Torres", "Lic. Miguel Torres"],
    studentCount: 32,
    accreditationDate: "2019-12-05",
    description: "Derecho civil y procesal civil",
  },
  {
    id: 15,
    careerName: "Derecho",
    year: "3ro",
    code: "DE-008-3",
    faculty: "Ciencias Jurídicas",
    trimesterTeachers: ["Dr. Juan Pérez", "Abg. Sofia Rodríguez", "Lic. Laura Fernández"],
    studentCount: 28,
    accreditationDate: "2019-12-05",
    description: "Derecho penal y criminología",
  },

  // Enfermería
  {
    id: 16,
    careerName: "Enfermería",
    year: "1er",
    code: "EN-004-1",
    faculty: "Ciencias de la Salud",
    trimesterTeachers: ["Lic. Ana Martínez", "Dr. Luis Ramírez", "Enf. Sofia Rodríguez"],
    studentCount: 28,
    accreditationDate: "2021-01-25",
    description: "Fundamentos de enfermería y anatomía",
  },
  {
    id: 17,
    careerName: "Enfermería",
    year: "2do",
    code: "EN-004-2",
    faculty: "Ciencias de la Salud",
    trimesterTeachers: ["Enf. Patricia Jiménez", "Dr. Diego Morales", "Lic. Valeria Sánchez"],
    studentCount: 25,
    accreditationDate: "2021-01-25",
    description: "Cuidados básicos y farmacología en enfermería",
  },
  {
    id: 18,
    careerName: "Enfermería",
    year: "3ro",
    code: "EN-004-3",
    faculty: "Ciencias de la Salud",
    trimesterTeachers: ["Dr. Andrés Herrera", "Enf. Laura Fernández", "Lic. Miguel Torres"],
    studentCount: 23,
    accreditationDate: "2021-01-25",
    description: "Enfermería clínica y cuidados especializados",
  },
  {
    id: 19,
    careerName: "Enfermería",
    year: "4to",
    code: "EN-004-4",
    faculty: "Ciencias de la Salud",
    trimesterTeachers: ["Enf. Juan Pérez", "Dra. Sofia Rodríguez", "Dr. Carlos López"],
    studentCount: 22,
    accreditationDate: "2021-01-25",
    description: "Práctica profesional y gestión en enfermería",
  },
]

const careers = ["Todas", "Ing. en Sistemas", "Administración", "Medicina", "Derecho", "Enfermería"]

const studentYears = ["Año", "1er", "2do", "3ro", "4to", "5to", "6to", "7mo"]

export default function CareersPage() {
  const [careerSections, setCareerSections] = useState<CareerSection[]>(initialCareerSections)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCareer, setSelectedCareer] = useState("Todas")
  const [selectedYear, setSelectedYear] = useState("Año")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<CareerSection | null>(null)
  const [formData, setFormData] = useState({
    careerName: "",
    year: "1er",
    code: "",
    faculty: "",
    trimesterTeachers: ["", "", ""],
    studentCount: 0,
    description: "",
    accreditationDate: "",
  })

  const filteredSections = careerSections.filter((section) => {
    const matchesSearch =
      section.careerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.trimesterTeachers.some((teacher) => teacher.toLowerCase().includes(searchTerm.toLowerCase())) ||
      section.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.year.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCareer = selectedCareer === "Todas" || section.careerName === selectedCareer
    const matchesYear = selectedYear === "Año" || section.year === selectedYear

    return matchesSearch && matchesCareer && matchesYear
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingSection) {
      setCareerSections(
        careerSections.map((section) =>
          section.id === editingSection.id
            ? {
                ...section,
                ...formData,
              }
            : section,
        ),
      )
    } else {
      const newSection: CareerSection = {
        id: Date.now(),
        ...formData,
      }
      setCareerSections([...careerSections, newSection])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      careerName: "",
      year: "1er",
      code: "",
      faculty: "",
      trimesterTeachers: ["", "", ""],
      studentCount: 0,
      description: "",
      accreditationDate: "",
    })
    setEditingSection(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (section: CareerSection) => {
    setEditingSection(section)
    setFormData({
      careerName: section.careerName,
      year: section.year,
      code: section.code,
      faculty: section.faculty,
      trimesterTeachers: section.trimesterTeachers,
      studentCount: section.studentCount,
      description: section.description,
      accreditationDate: section.accreditationDate,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setCareerSections(careerSections.filter((section) => section.id !== id))
  }

  const getFacultyColor = (faculty: string) => {
    const colors = {
      Ingeniería: "bg-blue-100 text-blue-800 border-blue-200",
      "Ciencias Económicas": "bg-green-100 text-green-800 border-green-200",
      "Ciencias Jurídicas": "bg-purple-100 text-purple-800 border-purple-200",
      "Ciencias Agropecuarias": "bg-orange-100 text-orange-800 border-orange-200",
      "Ciencias de la Salud": "bg-red-100 text-red-800 border-red-200",
      "Ciencias Sociales": "bg-pink-100 text-pink-800 border-pink-200",
      "Arquitectura y Diseño": "bg-indigo-100 text-indigo-800 border-indigo-200",
    }
    return colors[faculty as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getYearColor = (year: string) => {
    const colors = {
      "1er": "bg-green-100 text-green-800 border-green-200",
      "2do": "bg-blue-100 text-blue-800 border-blue-200",
      "3ro": "bg-purple-100 text-purple-800 border-purple-200",
      "4to": "bg-orange-100 text-orange-800 border-orange-200",
      "5to": "bg-red-100 text-red-800 border-red-200",
      "6to": "bg-pink-100 text-pink-800 border-pink-200",
      "7mo": "bg-indigo-100 text-indigo-800 border-indigo-200",
    }
    return colors[year as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const handleLogout = () => {
    console.log("Cerrando sesión...")
  }

  // Calcular estadísticas generales
  const totalStudents = careerSections.reduce((sum, section) => sum + section.studentCount, 0)
  const totalSections = careerSections.length
  const uniqueCareers = new Set(careerSections.map((section) => section.careerName)).size

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
              <h1 className="text-2xl font-bold text-gray-900">Carreras por Año</h1>
              <p className="text-sm text-gray-600">Gestiona secciones de carreras y maestros por trimestre</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <Award className="w-4 h-4" />
                  <span className="font-medium">{uniqueCareers}</span>
                  <span className="text-gray-500">carreras</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <GraduationCap className="w-4 h-4" />
                  <span className="font-medium">{totalSections}</span>
                  <span className="text-gray-500">secciones</span>
                </div>
                <div className="flex items-center gap-1 text-purple-600">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{totalStudents.toLocaleString()}</span>
                  <span className="text-gray-500">estudiantes</span>
                </div>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingSection(null)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Sección
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingSection ? "Editar Sección" : "Crear Nueva Sección"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="careerName">Nombre de la Carrera</Label>
                        <Input
                          id="careerName"
                          placeholder="ej. Ing. en Sistemas"
                          value={formData.careerName}
                          onChange={(e) => setFormData({ ...formData, careerName: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="year">Año</Label>
                        <Select
                          value={formData.year}
                          onValueChange={(value) => setFormData({ ...formData, year: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1er">1er Año</SelectItem>
                            <SelectItem value="2do">2do Año</SelectItem>
                            <SelectItem value="3ro">3er Año</SelectItem>
                            <SelectItem value="4to">4to Año</SelectItem>
                            <SelectItem value="5to">5to Año</SelectItem>
                            <SelectItem value="6to">6to Año</SelectItem>
                            <SelectItem value="7mo">7mo Año</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="code">Código</Label>
                        <Input
                          id="code"
                          placeholder="ej. IS-001-1"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="faculty">Facultad</Label>
                        <Input
                          id="faculty"
                          placeholder="ej. Ingeniería"
                          value={formData.faculty}
                          onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Descripción del Año</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe las materias y enfoque de este año..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label>Maestros del Trimestre (3 maestros)</Label>
                      <div className="space-y-2 mt-2">
                        {formData.trimesterTeachers.map((teacher, index) => (
                          <Input
                            key={index}
                            placeholder={`Maestro ${index + 1}`}
                            value={teacher}
                            onChange={(e) => {
                              const newTeachers = [...formData.trimesterTeachers]
                              newTeachers[index] = e.target.value
                              setFormData({ ...formData, trimesterTeachers: newTeachers })
                            }}
                            required
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="studentCount">Cantidad de Estudiantes</Label>
                        <Input
                          id="studentCount"
                          type="number"
                          min="0"
                          value={formData.studentCount}
                          onChange={(e) =>
                            setFormData({ ...formData, studentCount: Number.parseInt(e.target.value) || 0 })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="accreditationDate">Fecha de Acreditación</Label>
                        <Input
                          id="accreditationDate"
                          type="date"
                          value={formData.accreditationDate}
                          onChange={(e) => setFormData({ ...formData, accreditationDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button type="submit" className="flex-1">
                        {editingSection ? "Actualizar Sección" : "Crear Sección"}
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

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Career Filter Pills */}
            \
