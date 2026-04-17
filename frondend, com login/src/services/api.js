// Serviço de API para autenticação e gerenciamento de dados
const API_KEY = 'versiontrack_auth';

// Usuários mock para demonstração
const MOCK_USERS = [
  { id: 1, email: 'admin@versiontrack.com', password: 'admin123', name: 'Administrador' },
  { id: 2, email: 'dev@versiontrack.com', password: 'dev123', name: 'Desenvolvedor' },
];

export const api = {
  // Autenticação
  login: async (email, password) => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(API_KEY, JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, error: 'Email ou senha inválidos' };
  },

  logout: () => {
    localStorage.removeItem(API_KEY);
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(API_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(API_KEY);
  },

  // Feedback
  submitFeedback: async (feedbackData) => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simula salvamento (em produção, enviaria para um backend)
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    const newFeedback = {
      id: Date.now(),
      ...feedbackData,
      createdAt: new Date().toISOString(),
      user: api.getCurrentUser(),
    };
    
    feedbacks.push(newFeedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    
    return { success: true, feedback: newFeedback };
  },

  getFeedbacks: () => {
    return JSON.parse(localStorage.getItem('feedbacks') || '[]');
  },
};
