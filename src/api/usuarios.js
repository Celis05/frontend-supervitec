import axios from 'axios';

export const getUsuarios = async (token) => {
  const res = await axios.get('/auth/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteUsuario = async (id, token) => {
  await axios.delete(`/auth/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
