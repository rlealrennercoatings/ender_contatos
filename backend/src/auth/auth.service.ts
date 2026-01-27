import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

export interface User {
  oid: string // Object ID do Azure AD
  email: string
  name: string
  groups: string[] // Array de grupos que o usuário pertence
}

@Injectable()
export class AuthService {
  validateUser(profile: any): User {
    const user: User = {
      oid: profile.oid || profile.sub,
      email: profile.email || profile.upn,
      name: profile.name || profile.given_name,
      groups: profile.groups || [],
    }

    return user
  }

  hasPermission(groups: string[], requiredPermission: string): boolean {
    const permissionsMap: { [key: string]: string[] } = {
      'ENDER_ADMINISTRADORES': ['CREATE', 'EDIT', 'DELETE', 'VIEW'],
      'ENDER_EDITORES': ['CREATE', 'EDIT', 'VIEW'],
      'ENDER_LEITORES': ['VIEW'],
    }

    for (const group of groups) {
      const groupPermissions = permissionsMap[group] || []
      if (groupPermissions.includes(requiredPermission)) {
        return true
      }
    }

    return false
  }

  // Validar token JWT (se for necessário reutilizar)
  validateToken(token: string): any {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
      return decoded
    } catch (error) {
      return null
    }
  }
}
