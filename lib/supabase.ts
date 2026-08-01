import { createClient } from "@supabase/supabase-js";

// Mengambil variabel environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder";

// Inisialisasi Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Contoh Fungsi untuk Mengambil Data
 * @param tableName Nama tabel di Supabase
 * @returns Data dari tabel
 */
export async function fetchData(tableName: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching data dari ${tableName}:`, error.message);
    return null;
  }
  
  return data;
}

/**
 * Contoh Fungsi untuk Menambah Data Baru
 * @param tableName Nama tabel
 * @param payload Data yang ingin dimasukkan (object)
 */
export async function insertData(tableName: string, payload: any) {
  const { data, error } = await supabase.from(tableName).insert([payload]).select();
  
  if (error) {
    console.error(`Error inserting data ke ${tableName}:`, error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

/**
 * Contoh Fungsi untuk Mengupdate Data
 * @param tableName Nama tabel
 * @param id ID data yang ingin diubah
 * @param payload Data baru
 */
export async function updateData(tableName: string, id: number | string, payload: any) {
  const { data, error } = await supabase
    .from(tableName)
    .update(payload)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Error updating data di ${tableName}:`, error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

/**
 * Contoh Fungsi untuk Menghapus Data
 * @param tableName Nama tabel
 * @param id ID data yang ingin dihapus
 */
export async function deleteData(tableName: string, id: number | string) {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting data di ${tableName}:`, error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

/**
 * Fungsi untuk Mengupload Gambar ke Bucket Supabase
 * @param file File objek yang diupload (dari input file)
 * @param bucketName Nama bucket di Supabase
 */
export async function uploadImage(file: File, bucketName: string = 'portfolio-images') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError.message);
    return { success: false, error: uploadError.message };
  }

  // Dapatkan Public URL
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return { success: true, url: data.publicUrl };
}
