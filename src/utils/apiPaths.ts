export const API_PATHS = {
  AUTH: {
    LOGIN: '/api/users/login',
    SIGNUP: '/api/users/signup',
    GET_PROFILE: "/api/users/profile",
    FORGOT_PASSWORD: '/api/users/forgotpassword',
    RESET_PASSWORD: '/api/users/resetpassword',
  },
  RESUME: {
    GET_ALL: '/api/resumes',
    CREATE: '/api/resumes',
    GET_SINGLE: (id: string) => `/api/resumes/${id}`,
    UPDATE: (id: string) => `/api/resumes/${id}`,
    DELETE: (id: string) => `/api/resumes/${id}`,
  },
  image: {
        UPLOAD_IMAGE: "/api/images/upload",
        DEFAULT_THUMBNAIL: "/assets/images/default-resume.png", 
    }
};