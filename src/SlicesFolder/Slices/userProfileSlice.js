import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  skills: [],
  education: [],
  experience: [],
  projects: [],
  careerGoals: [],
  interests: [],
  certifications: [],
  personalDetails: {
    username: '',
    mobile: '',
    address: ''
  }
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Personal Details
    setPersonalDetails: (state, action) => {
      state.personalDetails = action.payload;
    },
    
    // Skills
    addSkill: (state, action) => {
      state.skills.push(action.payload);
    },
    removeSkill: (state, action) => {
      state.skills.splice(action.payload, 1);
    },
    
    // Education
    addEducation: (state, action) => {
      state.education.push(action.payload);
    },
    removeEducation: (state, action) => {
      state.education.splice(action.payload, 1);
    },
    
    // Experience
    addExperience: (state, action) => {
      state.experience.push(action.payload);
    },
    removeExperience: (state, action) => {
      state.experience.splice(action.payload, 1);
    },
    
    // Projects
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    removeProject: (state, action) => {
      state.projects.splice(action.payload, 1);
    },
    
    // Career Goals
    addCareerGoal: (state, action) => {
      state.careerGoals.push(action.payload);
    },
    removeCareerGoal: (state, action) => {
      state.careerGoals.splice(action.payload, 1);
    },
    
    // Interests
    addInterest: (state, action) => {
      state.interests.push(action.payload);
    },
    removeInterest: (state, action) => {
      state.interests.splice(action.payload, 1);
    },
    
    // Certifications
    addCertification: (state, action) => {
      state.certifications.push(action.payload);
    },
    removeCertification: (state, action) => {
      state.certifications.splice(action.payload, 1);
    }
  }
});

export const {
  setPersonalDetails,
  addSkill,
  removeSkill,
  addEducation,
  removeEducation,
  addExperience,
  removeExperience,
  addProject,
  removeProject,
  addCareerGoal,
  removeCareerGoal,
  addInterest,
  removeInterest,
  addCertification,
  removeCertification
} = profileSlice.actions;

export default profileSlice.reducer;
