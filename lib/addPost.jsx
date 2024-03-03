export async function addPost(post) {
    try {
      const req = await fetch('/api/add-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });
  
      if (!req.ok) {
        throw new Error(`Failed to add post. Status: ${req.status}`);
      }
  
        const res = await req.json();
      console.log('res', res);
    } catch (error) {
      console.error('Error adding post:', error.message);
    }
  }
  