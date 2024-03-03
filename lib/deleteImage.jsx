export async function deleteImageFromCloudinary(publicId) {
    const req = await fetch('api/delete-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_id: publicId }),
    });
  
    try {
      if (!req.ok) {
        throw new Error(`HTTP error! Status: ${req.status}`);
      }
  
      const res = await req.json();
      console.log(res.result);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }