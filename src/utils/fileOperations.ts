export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const prepareFileData = async (file: File) => {
  if (!file) return null;
  
  return {
    data: await fileToBase64(file),
    mimeType: file.type,
    fileName: file.name
  };
};