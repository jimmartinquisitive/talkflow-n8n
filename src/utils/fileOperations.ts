
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
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
