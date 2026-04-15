const API = "http://127.0.0.1:8000/api";

export const getFeedbacks = async () => {
  const res = await fetch(`${API}/feedback/feedbacks/`);
  return res.json();
};