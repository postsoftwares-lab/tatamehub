import { supabase } from '@/lib/supabase'

export interface Owner {
  id: string
  name: string
  email: string
  cpf: string
  phone: string | null
  created_at: string
}

export interface Academy {
  id: string
  name: string
  owner_id: string
  martial_art_id: number | null
  image: string | null
  created_at: string
}

export interface OwnerWithAcademy {
  owner: Owner | null
  academy: Academy | null
}

class OwnerService {
  async getOwnerByUserId(userId: string): Promise<Owner | null> {
    const { data, error } = await supabase
      .from('owners')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) return null
    return data
  }

  async getAcademyByOwnerId(ownerId: string): Promise<Academy | null> {
    const { data, error } = await supabase
      .from('academies')
      .select('*')
      .eq('owner_id', ownerId)
      .single()

    if (error) return null
    return data
  }

  async getOwnerWithAcademy(userId: string): Promise<OwnerWithAcademy> {
    const owner = await this.getOwnerByUserId(userId)
    
    if (!owner) {
      return { owner: null, academy: null }
    }

    const academy = await this.getAcademyByOwnerId(owner.id)
    
    return { owner, academy }
  }
}

export const ownerService = new OwnerService()
