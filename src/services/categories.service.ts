import { supabase } from '@/lib/supabase'

export interface AgeCategory {
  id: number
  name: string
  slug: string
  min_age: number
  max_age: number
}

export interface Belt {
  id: number
  name: string
  slug: string
}

export interface Gender {
  id: number
  name: string
  slug: string
}

export interface AgeCategoryBelt {
  age_category_id: number
  belt_id: number
  belt_name: string
}

export interface WeightCategory {
  id: number
  age_category_id: number
  gender_id: number
  weight_division_id: number
  max_weight: string
  division_name: string
}

export interface WeightDivision {
  id: number
  name: string
  slug: string
}

class CategoriesService {
  async getAgeCategories(): Promise<AgeCategory[]> {
    const { data, error } = await supabase
      .from('age_categories')
      .select('*')
      .order('min_age')

    if (error) {
      console.error('Error fetching age categories:', error)
      return []
    }

    return data || []
  }

  async getBelts(): Promise<Belt[]> {
    const { data, error } = await supabase
      .from('belts')
      .select('*')
      .order('id')

    if (error) {
      console.error('Error fetching belts:', error)
      return []
    }

    return data || []
  }

  async getGenders(): Promise<Gender[]> {
    const { data, error } = await supabase
      .from('genders')
      .select('*')
      .order('id')

    if (error) {
      console.error('Error fetching genders:', error)
      return []
    }

    return data || []
  }

  async getAgeCategoryBelts(): Promise<AgeCategoryBelt[]> {
    const { data, error } = await supabase
      .from('age_category_belts')
      .select(`
        age_category_id,
        belt_id,
        belts!inner(name)
      `)
      .order('age_category_id')

    if (error) {
      console.error('Error fetching age category belts:', error)
      return []
    }

    return (data || []).map((item: any) => ({
      age_category_id: item.age_category_id,
      belt_id: item.belt_id,
      belt_name: item.belts.name
    }))
  }

  async getWeightCategories(): Promise<WeightCategory[]> {
    const { data, error } = await supabase
      .from('weight_categories')
      .select(`
        id,
        age_category_id,
        gender_id,
        weight_division_id,
        max_weight,
        weight_divisions!inner(name)
      `)
      .order('weight_division_id')
      .order('max_weight')

    if (error) {
      console.error('Error fetching weight categories:', error)
      return []
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      age_category_id: item.age_category_id,
      gender_id: item.gender_id,
      weight_division_id: item.weight_division_id,
      max_weight: item.max_weight,
      division_name: item.weight_divisions.name
    }))
  }

  async getWeightDivisions(): Promise<WeightDivision[]> {
    const { data, error } = await supabase
      .from('weight_divisions')
      .select('*')
      .order('id')

    if (error) {
      console.error('Error fetching weight divisions:', error)
      return []
    }

    return data || []
  }

  getBeltsForAgeCategory(ageCategoryId: number, ageCategoryBelts: AgeCategoryBelt[]): string[] {
    return ageCategoryBelts
      .filter(acb => acb.age_category_id === ageCategoryId)
      .map(acb => acb.belt_name)
  }

  calculateAgeCategory(birthDate: string, ageCategories: AgeCategory[]): AgeCategory | null {
    if (!birthDate) return null

    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return ageCategories.find(cat => age >= cat.min_age && age <= cat.max_age) || null
  }

  calculateWeightCategory(
    weight: number,
    ageCategoryId: number,
    genderId: number,
    weightCategories: WeightCategory[]
  ): string | null {
    const applicableCategories = weightCategories.filter(
      wc => wc.age_category_id === ageCategoryId && wc.gender_id === genderId
    )

    const category = applicableCategories.find(wc => weight <= parseFloat(wc.max_weight))
    return category ? category.division_name : null
  }

  getAvailableCategories(
    birthDate: string,
    genderId: number,
    ageCategories: AgeCategory[],
    weightCategories: WeightCategory[]
  ): string[] {
    const ageCategory = this.calculateAgeCategory(birthDate, ageCategories)
    if (!ageCategory) return []

    const categories: string[] = []

    // Para categorias de base (até 15 anos), apenas categoria de idade
    if (ageCategory.max_age < 16) {
      categories.push(ageCategory.name)
      return categories
    }

    // Adicionar categoria simples
    categories.push(ageCategory.name)

    // Adicionar categorias com divisão de peso
    const applicableWeights = weightCategories.filter(
      wc => wc.age_category_id === ageCategory.id && wc.gender_id === genderId
    )

    const uniqueDivisions = new Set<string>()
    applicableWeights.forEach(wc => {
      if (!uniqueDivisions.has(wc.division_name)) {
        uniqueDivisions.add(wc.division_name)
        categories.push(`${ageCategory.name} - ${wc.division_name}`)
      }
    })

    return categories
  }
}

export const categoriesService = new CategoriesService()
