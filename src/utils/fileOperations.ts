
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    // Clean up the reader after use
    const cleanup = () => {
      reader.onload = null;
      reader.onerror = null;
      reader.abort();
    };
    
    reader.onload = () => {
      try {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        cleanup();
        resolve(base64Data);
      } catch (error) {
        cleanup();
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      cleanup();
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

export const prepareFileData = async (file: File) => {
  if (!file) return null;
  
  try {
    const data = await fileToBase64(file);
    return {
      data,
      mimeType: file.type,
      fileName: file.name
    };
  } catch (error) {
    console.error('Error preparing file data:', error);
    throw error;
  }
};
