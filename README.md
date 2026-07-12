<div align="center">

# NeighborNet

A modern community-driven platform for discovering nearby resources through an interactive map and intuitive search experience.

<p>
  <a href="https://neighbornet-ten.vercel.app/" target="_blank"><strong>Live Demo</strong></a>
  ·
  <a href="https://github.com/Zephyrex21/neighbornet/issues"><strong>Report Issues</strong></a>
  ·
  <a href="https://github.com/Zephyrex21/neighbornet/issues"><strong>Request Features</strong></a>
</p>

</div>

---

## Overview

NeighborNet is a modern community resource discovery platform that helps users explore nearby places through an interactive map and an intuitive list interface. Whether it's public facilities, local services, or community spaces, the platform enables fast and seamless discovery based on location, category, and accessibility.

Built with a modern React ecosystem, NeighborNet emphasizes performance, scalability, and a clean user experience while leveraging Firebase for real-time data management and Leaflet for interactive mapping.

---

## Features

- Interactive map powered by Leaflet
- Marker clustering for improved map readability
- Real-time geolocation support
- Debounced search experience
- Category-based resource filtering
- Accessibility filters
- Responsive map and list layouts
- Dark and light theme support
- Community resource submission
- Virtualized rendering for large datasets
- Lazy-loaded components for faster initial load
- Firebase Firestore integration

---

## Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Maps | Leaflet, React Leaflet, React Leaflet Cluster |
| Backend | Firebase |
| Database | Cloud Firestore |
| Icons | Lucide React |
| Performance | React Virtuoso, React Lazy, Suspense |
| Linting | Oxlint |

---

## Performance Optimizations

NeighborNet incorporates several modern optimization techniques to ensure a smooth user experience.

- Lazy-loaded components using `React.lazy()`
- Code splitting with Suspense
- React 19 concurrent rendering with `useTransition()`
- Memoized computations using `useMemo()`
- Stable callbacks using `useCallback()`
- Debounced search input
- Virtualized resource lists using React Virtuoso
- Idle-time component prefetching
- Optimized map marker clustering

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Zephyrex21/neighbornet.git
```

### Navigate into the project

```bash
cd neighbornet
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

---

## Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Screenshots

> Screenshots will be added soon.

- Home Page
- Interactive Map
- Resource List
- Dark Theme
- Add Resource Modal

---

## Future Improvements

- User authentication
- Favorites and bookmarks
- Resource reviews and ratings
- Progressive Web App support
- Offline caching
- Image uploads
- AI-powered recommendations
- Advanced search and filtering

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

---

## License

This project is licensed under the MIT License.

---

<div align="center">

Built with React, TypeScript, Firebase, and Leaflet.

</div>
