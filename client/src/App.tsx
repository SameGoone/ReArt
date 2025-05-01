import { List, ListItem, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Im5pa2l0YSIsIm5hbWVpZCI6IjNiNDAyNzJiLTRiNzYtNDI4Yy04NjA2LWY0NmUxYjIxMGZkZSIsImVtYWlsIjoibmlraXRhQG0ubSIsIm5iZiI6MTc0NjExMTYxNCwiZXhwIjoxNzQ2NzE2NDE0LCJpYXQiOjE3NDYxMTE2MTR9.WerNJOBXiaXAqYFncWD6f_LaFeCrpI7OjzqVM-71ooeMt41-P74UXPY9ibi-hyPlXl9N5X9FzsK5TvrfvNXt6g'
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    axios.get<Post[]>('http://localhost:5010/api/Posts', config)
      .then(response => setPosts(response.data))


    return () => {}
  }, [])

  return (
    <>
      <Typography variant='h3'>Posts</Typography>
      <List>
        {posts.map(post => (
          <ListItem key={post.id}>
            <ListItemText>{post.body}</ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default App
