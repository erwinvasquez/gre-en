// // src/redux/slices/themeSlice.ts

// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// type ThemeType = 'light' | 'dark' | 'system';

// interface ThemeState {
//   theme: ThemeType;
// }

// // Intentamos obtener el tema guardado en localStorage o usamos 'system' por defecto
// const getInitialTheme = (): ThemeType => {
//   if (typeof window !== 'undefined') {
//     const savedTheme = localStorage.getItem('theme') as ThemeType;
//     if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
//       return savedTheme;
//     }
//   }
//   return 'system';
// };

// const initialState: ThemeState = {
//   theme: getInitialTheme(),
// };

// const themeSlice = createSlice({
//   name: 'theme',
//   initialState,
//   reducers: {
//     setTheme: (state, action: PayloadAction<ThemeType>) => {
//       state.theme = action.payload;
//       // Guardamos el tema seleccionado en localStorage
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('theme', action.payload);
//       }
//     },
//   },
// });

// export const { setTheme } = themeSlice.actions;
// export default themeSlice.reducer;