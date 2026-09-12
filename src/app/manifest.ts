import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nnenna Orji Charity Foundation',
    short_name: 'NOCF',
    description: 'A Nigerian foundation built on one simple December tradition: packing a box, and handing it to someone who did not expect to be remembered.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#DC3D00',
    icons: [
      {
        src: '/images/Icon.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/images/Icon.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      }
    ],
  }
}
