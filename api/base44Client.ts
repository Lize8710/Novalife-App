// Base44 Client Configuration
// This client uses localStorage for demo purposes

interface Character {
  id: string;
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
  created_date?: string;
  updated_date?: string;
}

// Helper to get localStorage data (safe for SSR)
const getStorageData = (key: string): any[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Helper to save localStorage data
const saveStorageData = (key: string, data: any[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const STORAGE_KEY = 'characters_db';

// Character entity methods
const characterMethods = {
  list: async (sortBy: string = '-created_date') => {
    const characters = getStorageData(STORAGE_KEY);
    
    // Sort by created_date descending by default
    if (sortBy === '-created_date') {
      return characters.sort((a, b) => 
        new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime()
      );
    }
    return characters;
  },
  
  get: async (id: string) => {
    const characters = getStorageData(STORAGE_KEY);
    return characters.find(c => c.id === id) || null;
  },
  
  create: async (data: any) => {
    const characters = getStorageData(STORAGE_KEY);
    const id = Date.now().toString();
    const newCharacter: Character = {
      ...data,
      id,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    };
    characters.push(newCharacter);
    saveStorageData(STORAGE_KEY, characters);
    return newCharacter;
  },
  
  update: async (id: string, data: any) => {
    const characters = getStorageData(STORAGE_KEY);
    const index = characters.findIndex(c => c.id === id);
    if (index !== -1) {
      characters[index] = {
        ...characters[index],
        ...data,
        id,
        updated_date: new Date().toISOString(),
      };
      saveStorageData(STORAGE_KEY, characters);
      return characters[index];
    }
    return null;
  },
  
  delete: async (id: string) => {
    const characters = getStorageData(STORAGE_KEY);
    const filtered = characters.filter(c => c.id !== id);
    saveStorageData(STORAGE_KEY, filtered);
    return { success: true };
  },
};

// Integration methods
const integrationMethods = {
  Core: {
    UploadFile: async (data: { file: File }) => {
      // Create a blob URL for the file
      const file_url = URL.createObjectURL(data.file);
      return {
        file_url,
        file_name: data.file.name,
        file_size: data.file.size,
      };
    },
  },
};

// Export base44 client
export const base44 = {
  entities: {
    Character: characterMethods,
  },
  integrations: integrationMethods,
};
