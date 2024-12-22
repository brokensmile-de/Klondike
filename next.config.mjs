/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    assetPrefix: 'https://klondike.brokensmile.de', // Setzt alle Assets auf einen relativen Pfad
    trailingSlash: true, // Fügt einen Slash am Ende jedes Pfads hinzu
  };
  
  export default nextConfig;