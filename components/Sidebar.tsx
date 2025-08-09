"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useState, useEffect } from "react"

import {
  Phone,
  Building,
  User,
  Users,
  GraduationCap,
  Bell,
  UserPlus,
  LogOut,
  Activity,
  Menu,
} from "lucide-react"


interface SidebarProps {
  onLogout: () => void
  showUserInfo?: boolean
  notificationCount?: number
}

export default function Sidebar({
  onLogout,
  showUserInfo = true,
  notificationCount = 3,
}: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
  const storedState = localStorage.getItem("sidebar-collapsed")
  if (storedState === "true") setIsCollapsed(true)
}, [])

// Guardar en localStorage cuando cambie
useEffect(() => {
  localStorage.setItem("sidebar-collapsed", isCollapsed.toString())
}, [isCollapsed])

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800 border-red-200",
      profesor: "bg-blue-100 text-blue-800 border-blue-200",
      estudiante: "bg-green-100 text-green-800 border-green-200",
      oficina: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const navigationItems = [
    { href: "/dashboard", icon: Activity, label: "Dashboard", show: true },
    { href: "/agenda", icon: Phone, label: "Agenda telefónica", show: true },
    { href: "/usuarios", icon: Users, label: "Usuarios", show: true },
    { href: "/grupos", icon: Building, label: "Grupos", show: true },
    { href: "/carreras", icon: GraduationCap, label: "Carreras", show: true },
    { href: "/perfil", icon: User, label: "Perfil", show: true },
    { href: "/notificaciones", icon: Bell, label: "Notificaciones", show: true, badge: notificationCount },
    { href: "/invitaciones", icon: UserPlus, label: "Invitaciones", show: true },
  ]

  return (
    <div
      className={`h-screen bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 text-white flex flex-col shadow-2xl transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header con botón de menú */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-green-400/30 bg-gradient-to-r from-green-700/20 to-emerald-700/20">
        <button onClick={toggleSidebar} className="text-white hover:text-green-200">
          <Menu className="w-6 h-6" />
        </button>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Image src="/logo-uml.png" alt="UML Logo" 1/>
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          if (!item.show) return null

          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white/20 text-white shadow-lg shadow-black/10"
                  : "text-green-100 hover:bg-white/10 hover:text-white hover:shadow-md"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-green-200"}`} />
              {!isCollapsed && <span className="flex-1">{item.label}</span>}
              {!isCollapsed && item.badge && item.badge > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      {showUserInfo && user && (
        <div className="p-4 border-t border-green-400/30 bg-gradient-to-r from-green-700/10 to-emerald-700/10">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-sm">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user.nombres} {user.apellidos}
                  </p>
                  <p className="text-xs text-green-100 truncate">{user.correo}</p>
                </div>
              </div>
              <Badge className={`${getRoleColor(user.rol || "")} text-xs w-full justify-center py-2 font-medium`}>
                {user.rol?.toUpperCase() || "USUARIO"}
              </Badge>
            </>
          ) : (
            <div className="flex justify-center items-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      )}

      {/* Botón logout */}
      <div className="p-4 border-t border-green-400/30">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-green-100 hover:bg-red-500/20 hover:text-white hover:shadow-md ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && "Cerrar Sesión"}
        </button>
      </div>
    </div>
  )
}
