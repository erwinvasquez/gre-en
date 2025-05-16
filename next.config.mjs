import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para redireccionar robots.txt y sitemap.xml a las rutas API
  async redirects() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots',
        permanent: true,
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
        permanent: true,
      },
    ]
  },
  
  // Configuración adicional para optimización de imágenes
  images: {
    domains: [
      'raw.githubusercontent.com', // Para las imágenes de Pokémon
      'lh3.googleusercontent.com', // Para fotos de perfil de Google
      'identitytoolkit.googleapis.com', // Para Firebase Auth
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Configuración para webpack (si necesitas personalizar)
  webpack: (config) => {
    // Aquí puedes añadir configuraciones personalizadas de webpack
    return config;
  },
};
 
// Aplicar el plugin de next-intl a la configuración
export default withNextIntl(nextConfig);
