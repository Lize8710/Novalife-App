import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

interface Character {
  id?: string;
  first_name: string;
  last_name: string;
  birth_date?: string;
  nationality?: string;
  phone?: string;
  social_score?: string;
  profession?: string;
  address?: string;
  blood_type?: string;
  doctor?: string;
  medical_history?: string;
  trusted_persons?: any[];
  avatar_url?: string;
  attachments?: any[];
  created_at?: string;
  updated_at?: string;
}

export const characterMethods = {
  list: async (sortBy = 'created_at', page = 1, pageSize = 12) => {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await supabase
        .from('characters')
        .select('*', { count: 'exact' })
        .order(sortBy, { ascending: false })
        .range(from, to);
      if (error) throw error;
      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error fetching characters:', error);
      return { data: [], count: 0 };
    }
  },
  
  get: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching character:', error);
      return null;
    }
  },
  
  create: async (data: Character) => {
    try {
      const { data: result, error } = await supabase
        .from('characters')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error creating character:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: Partial<Character>) => {
    try {
      const { data: result, error } = await supabase
        .from('characters')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error updating character:', error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting character:', error);
      throw error;
    }
  },
};

export const integrationMethods = {
  Core: {
    UploadFile: async (data: { file: File }) => {
      try {
        const fileName = `${Date.now()}_${data.file.name}`;
        const { data: uploadData, error } = await supabase.storage
          .from('attachments')
          .upload(fileName, data.file);
        
        if (error) throw error;
        
        const { data: urlData } = supabase.storage
          .from('attachments')
          .getPublicUrl(fileName);
        
        return {
          file_url: urlData.publicUrl,
          file_name: data.file.name,
          file_size: data.file.size,
        };
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    },
  },
};

export const base44 = {
  entities: {
    Character: characterMethods,
  },
  integrations: integrationMethods,
};
