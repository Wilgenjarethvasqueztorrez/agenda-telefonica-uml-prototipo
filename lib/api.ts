// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Tipos basados en el schema de Prisma
export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  fecha?: string;
  nivel?: number;
  correo: string;
  celular?: string;
  telefono?: string;
  rol?: 'admin' | 'profesor' | 'estudiante' | 'oficina';
  carnet?: string;
  carrera_id?: number;
  carrera?: Carrera;
}

export interface Carrera {
  id: number;
  nombre: string;
  codigo: number;
  usuarios?: Usuario[];
}

export interface Grupo {
  id: number;
  nombre: string;
  creador_id: number;
  creador?: Usuario;
  invitaciones?: Invitacion[];
  miembros?: Miembro[];
}

export interface Miembro {
  id: number;
  usuario_id: number;
  grupo_id: number;
  usuario?: Usuario;
  grupo?: Grupo;
}

export interface Invitacion {
  id: number;
  fecha: string;
  sender_id: number;
  receiver: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  grupo_id: number;
  sender?: Usuario;
  grupo?: Grupo;
}

// Cliente API
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getSessionToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sessionToken');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if authentication is required
    if (requireAuth) {
      const token = this.getSessionToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Merge with any additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers);
    }
    
    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(accessToken: string): Promise<ApiResponse<{ usuario: Usuario; sessionToken: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    }, false); // No auth required for login
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    }, true); // Auth required for logout
  }

  async getCurrentUser(): Promise<ApiResponse<{ usuario: Usuario }>> {
    return this.request('/auth/profile', {}, true); // Auth required
  }

  // Usuarios endpoints
  async getUsuarios(params?: {
    page?: number;
    limit?: number;
    search?: string;
    rol?: string;
    carrera_id?: number;
  }): Promise<ApiResponse<Usuario[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/usuarios?${searchParams.toString()}`);
  }

  async getUsuario(id: number): Promise<ApiResponse<Usuario>> {
    return this.request(`/usuarios/${id}`);
  }

  async createUsuario(data: Partial<Usuario>): Promise<ApiResponse<Usuario>> {
    return this.request('/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUsuario(id: number, data: Partial<Usuario>): Promise<ApiResponse<Usuario>> {
    return this.request(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUsuario(id: number): Promise<ApiResponse> {
    return this.request(`/usuarios/${id}`, {
      method: 'DELETE',
    });
  }

  async getRoles(): Promise<ApiResponse<Array<{ value: string; label: string }>>> {
    return this.request('/usuarios/roles');
  }

  // Carreras endpoints
  async getCarreras(): Promise<ApiResponse<Carrera[]>> {
    return this.request('/carreras');
  }

  async getCarrera(id: number): Promise<ApiResponse<Carrera>> {
    return this.request(`/carreras/${id}`);
  }

  async createCarrera(data: { nombre: string; codigo: number }): Promise<ApiResponse<Carrera>> {
    return this.request('/carreras', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCarrera(id: number, data: { nombre: string; codigo: number }): Promise<ApiResponse<Carrera>> {
    return this.request(`/carreras/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCarrera(id: number): Promise<ApiResponse> {
    return this.request(`/carreras/${id}`, {
      method: 'DELETE',
    });
  }

  async getCarreraUsuarios(id: number): Promise<ApiResponse<{ carrera: Carrera; usuarios: Usuario[] }>> {
    return this.request(`/carreras/${id}/usuarios`);
  }

  // Grupos endpoints
  async getGrupos(params?: {
    page?: number;
    limit?: number;
    search?: string;
    creador_id?: number;
  }): Promise<ApiResponse<Grupo[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/grupos?${searchParams.toString()}`);
  }

  async getGrupo(id: number): Promise<ApiResponse<Grupo>> {
    return this.request(`/grupos/${id}`);
  }

  async createGrupo(data: { nombre: string; creador_id: number }): Promise<ApiResponse<Grupo>> {
    return this.request('/grupos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGrupo(id: number, data: { nombre: string }): Promise<ApiResponse<Grupo>> {
    return this.request(`/grupos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGrupo(id: number): Promise<ApiResponse> {
    return this.request(`/grupos/${id}`, {
      method: 'DELETE',
    });
  }

  async getUsuarioGrupos(usuarioId: number): Promise<ApiResponse<Grupo[]>> {
    return this.request(`/grupos/usuario/${usuarioId}`);
  }

  // Miembros endpoints
  async getMiembros(params?: {
    page?: number;
    limit?: number;
    grupo_id?: number;
    usuario_id?: number;
  }): Promise<ApiResponse<Miembro[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/miembros?${searchParams.toString()}`);
  }

  async getMiembro(id: number): Promise<ApiResponse<Miembro>> {
    return this.request(`/miembros/${id}`);
  }

  async addMiembro(data: { usuario_id: number; grupo_id: number }): Promise<ApiResponse<Miembro>> {
    return this.request('/miembros', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeMiembro(id: number): Promise<ApiResponse> {
    return this.request(`/miembros/${id}`, {
      method: 'DELETE',
    });
  }

  async removeMiembroFromGrupo(grupoId: number, usuarioId: number): Promise<ApiResponse> {
    return this.request(`/miembros/grupo/${grupoId}/usuario/${usuarioId}`, {
      method: 'DELETE',
    });
  }

  async getGrupoMiembros(grupoId: number): Promise<ApiResponse<Miembro[]>> {
    return this.request(`/miembros/grupo/${grupoId}`);
  }

  async getUsuarioMiembros(usuarioId: number): Promise<ApiResponse<Miembro[]>> {
    return this.request(`/miembros/usuario/${usuarioId}`);
  }

  // Invitaciones endpoints (basado en el schema)
  async getInvitaciones(params?: {
    page?: number;
    limit?: number;
    sender_id?: number;
    receiver?: string;
    estado?: string;
    grupo_id?: number;
  }): Promise<ApiResponse<Invitacion[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/invitaciones?${searchParams.toString()}`);
  }

  async getInvitacion(id: number): Promise<ApiResponse<Invitacion>> {
    return this.request(`/invitaciones/${id}`);
  }

  async createInvitacion(data: {
    sender_id: number;
    receiver: string;
    grupo_id: number;
  }): Promise<ApiResponse<Invitacion>> {
    return this.request('/invitaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInvitacion(id: number, data: { estado: string }): Promise<ApiResponse<Invitacion>> {
    return this.request(`/invitaciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInvitacion(id: number): Promise<ApiResponse> {
    return this.request(`/invitaciones/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  async getInfo(): Promise<ApiResponse> {
    return this.request('/info');
  }
}

// Instancia global del cliente API
export const apiClient = new ApiClient(API_BASE_URL);

// Hooks personalizados para React
export const useApi = () => {
  return {
    client: apiClient,
    // Aquí puedes agregar hooks específicos si es necesario
  };
}; 