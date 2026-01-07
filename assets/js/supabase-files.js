// Supabase Files Adapter
// Handles file uploads and management with Supabase

// Use global supabaseClient
(function() {
const supabase = window.supabaseClient;

// Storage bucket validation and setup
async function ensureStorageBucket() {
  try {
    console.log('🪣 Checking storage bucket configuration...');
    
    // Try to list files in the bucket directly instead of listBuckets (which requires admin)
    const { data, error } = await supabase.storage.from('files').list('', { limit: 1 });
    
    if (error) {
      // Check if it's a "not found" error vs permission error
      if (error.message?.includes('not found') || error.statusCode === 404) {
        console.error('❌ Storage bucket "files" does not exist!');
        console.log('📝 To fix this, go to your Supabase Dashboard:');
        console.log('   1. Go to Storage > Buckets');
        console.log('   2. Create a new bucket named "files"');
        console.log('   3. Make it public');
        console.log('   4. Refresh this page');
        return false;
      }
      // Permission errors mean bucket exists but we can't list - that's OK
      console.log('⚠️ Cannot list bucket contents (may need policies), but bucket likely exists');
    }
    
    console.log('✅ Storage bucket "files" is accessible');
    return true;
    
  } catch (error) {
    console.error('❌ Storage bucket check failed:', error);
    return false;
  }
}

window.SupabaseFiles = {
  // Validate storage setup
  ensureStorageBucket,
  // Upload file to storage and create database record
  async uploadFile(fileData, fileBlob) {
    try {
      const userId = parseInt(sessionStorage.getItem('userId'));
      const timestamp = Date.now();
      const fileName = `${userId}_${timestamp}_${fileData.filename}`;

      // Upload file to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('files')
        .upload(`originals/${fileName}`, fileBlob, {
          contentType: fileBlob.type,
          upsert: false
        });

      if (storageError) throw storageError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('files')
        .getPublicUrl(`originals/${fileName}`);

      // Create database record
      const dbRecord = {
        user_id: userId,
        customer_email: fileData.customerEmail,
        customer_name: fileData.customerName,
        vehicle: fileData.vehicle,
        manufacturer: fileData.manufacturer,
        model: fileData.model,
        year: fileData.year,
        engine: fileData.engine,
        registration: fileData.registration,
        transmission: fileData.transmission,
        ecu: fileData.ecu,
        tcu: fileData.tcu,
        tool: fileData.tool,
        stage: fileData.stage,
        solutions: fileData.solutions || [],
        options: fileData.options || [],
        pricing: fileData.pricing || {},
        total_price: fileData.totalPrice || 0,
        status: fileData.status || 'queued',
        filename: fileData.filename,
        original_file: urlData.publicUrl,
        size: fileData.size,
        upload_date: new Date().toISOString()
      };
      
      console.log('Inserting to Supabase:', dbRecord);
      
      const { data, error } = await supabase
        .from('files')
        .insert([dbRecord])
        .select();

      if (error) throw error;

      // Handle both array and single object responses
      const result = Array.isArray(data) ? data[0] : data;
      console.log('Supabase insert result:', result);
      
      // Send email notification to admin
      try {
        console.log('📧 Sending upload notification email...');
        // Use global API URL from main.js
        const apiUrl = window.CARNAGE_API_URL || 'https://web-production-df12d.up.railway.app';
        console.log('📧 Using API URL:', apiUrl);
        const notifyResponse = await fetch(`${apiUrl}/api/notify-file-upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: fileData.customerName,
            customer_email: fileData.customerEmail,
            vehicle: fileData.vehicle,
            engine: fileData.engine,
            filename: fileData.filename,
            stage: fileData.stage,
            total_price: fileData.totalPrice
          })
        });
        const notifyData = await notifyResponse.json();
        console.log('📧 Notification response:', notifyData);
        
        if (notifyData.email_sent) {
          console.log('✅ EMAIL CONFIRMED - Admin has been notified');
        } else if (notifyData.success) {
          console.log('⚠️ Notification endpoint responded but email may not have sent');
        } else {
          console.warn('❌ Notification endpoint failed:', notifyData.error);
        }
      } catch (notifyError) {
        console.error('⚠️ Failed to send notification email:', notifyError);
        // Don't throw - file uploaded successfully even if email fails
      }
      
      return result;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  },

  // Get all files
  async getAllFiles() {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('upload_date', { ascending: false });

    if (error) throw error;
    
    // Transform snake_case to camelCase for compatibility
    return (data || []).map(file => ({
      id: file.id,
      name: file.filename,
      filename: file.filename,
      size: file.size,
      uploadDate: file.upload_date,
      customerEmail: file.customer_email,
      customerName: file.customer_name,
      vehicle: file.vehicle,
      manufacturer: file.manufacturer,
      model: file.model,
      year: file.year,
      engine: file.engine,
      registration: file.registration,
      transmission: file.transmission,
      ecu: file.ecu,
      tcu: file.tcu,
      tool: file.tool,
      stage: file.stage,
      solution: file.stage,
      solutions: file.solutions || [],
      options: file.options || [],
      pricing: file.pricing || {},
      totalPrice: file.total_price,
      status: file.status,
      originalFile: file.original_file,
      modifiedFile: file.modified_file,
      messages: []  // Messages loaded separately
    }));
  },

  // Get file by ID
  async getFileById(fileId) {
    const { data: file, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (error) throw error;
    
    // Transform to camelCase
    return {
      id: file.id,
      name: file.filename,
      filename: file.filename,
      size: file.size,
      uploadDate: file.upload_date,
      customerEmail: file.customer_email,
      customerName: file.customer_name,
      vehicle: file.vehicle,
      manufacturer: file.manufacturer,
      model: file.model,
      year: file.year,
      engine: file.engine,
      registration: file.registration,
      transmission: file.transmission,
      ecu: file.ecu,
      tcu: file.tcu,
      tool: file.tool,
      stage: file.stage,
      solution: file.stage,
      solutions: file.solutions || [],
      options: file.options || [],
      pricing: file.pricing || {},
      totalPrice: file.total_price,
      status: file.status,
      originalFile: file.original_file,
      modifiedFile: file.modified_file,
      messages: []
    };
  },

  // Get files by user
  async getFilesByUser(userId) {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', userId)
      .order('upload_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update file
  async updateFile(fileId, updates) {
    const { data, error } = await supabase
      .from('files')
      .update(updates)
      .eq('id', fileId)
      .select();

    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  },

  // Upload modified/tuned file (admin)
  async uploadModifiedFile(fileId, modifiedBlob, filename) {
    try {
      const timestamp = Date.now();
      const modifiedFileName = `modified_${timestamp}_${filename}`;

      // Upload to storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('files')
        .upload(`modified/${modifiedFileName}`, modifiedBlob, {
          contentType: modifiedBlob.type,
          upsert: false
        });

      if (storageError) throw storageError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('files')
        .getPublicUrl(`modified/${modifiedFileName}`);

      // Update file record
      const { data, error } = await supabase
        .from('files')
        .update({
          modified_file: urlData.publicUrl,
          status: 'completed'
        })
        .eq('id', fileId)
        .select();

      if (error) throw error;

      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      console.error('Modified file upload error:', error);
      throw error;
    }
  },

  // Delete file
  async deleteFile(fileId) {
    try {
      // Get file info first
      const file = await this.getFileById(fileId);

      // Delete from storage
      if (file.original_file) {
        const originalPath = file.original_file.split('/files/')[1];
        await supabase.storage.from('files').remove([originalPath]);
      }

      if (file.modified_file) {
        const modifiedPath = file.modified_file.split('/files/')[1];
        await supabase.storage.from('files').remove([modifiedPath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      throw error;
    }
  },

  // Download file
  async downloadFile(fileUrl, filename) {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },

  // Get file messages
  async getFileMessages(fileId) {
    const { data, error } = await supabase
      .from('file_messages')
      .select('*')
      .eq('file_id', fileId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Add file message
  async addFileMessage(fileId, message, isAdmin = false) {
    const userId = parseInt(sessionStorage.getItem('userId'));
    const userName = sessionStorage.getItem('userName');

    const { data, error } = await supabase
      .from('file_messages')
      .insert([
        {
          file_id: fileId,
          user_id: userId,
          sender_name: userName,
          message: message,
          is_admin: isAdmin
        }
      ])
      .select();

    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  }
};

console.log('✅ Supabase Files module loaded');
})(); // End IIFE
