<div align="center">

# NeighborNet

A modern community-driven platform for discovering nearby resources through an interactive map and intuitive search experience.

Live Demo • Report Issues • Request Features

</div>

---

## Overview

NeighborNet helps users explore nearby community resources using an interactive map and a searchable list interface. Whether it's public facilities, local services, or community spaces, the platform provides a fast and responsive way to discover resources based on location, category, and accessibility.

Built with modern React technologies and optimized for performance, NeighborNet emphasizes smooth user experience, scalable architecture, and clean component design.

---

## Features

- Interactive map powered by Leaflet
- Clustered map markers for improved readability
- Real-time location detection
- Search with debounced input
- Category-based filtering
- Accessibility filters
- Responsive map and list views
- Dark and light theme support
- Community resource submission
- Virtualized lists for large datasets
- Lazy-loaded components for faster initial load
- Firebase integration for persistent data

---

## Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Maps | Leaflet, React Leaflet |
| Database | Firebase Firestore |
| Icons | Lucide React |
| Performance | React Virtuoso, React Lazy, Suspense |
| Linting | Oxlint |

---

## Project Structure

```text
src
├── components
├── hooks
├── lib
├── App.tsx
└── main.tsx
```

### Components

- Navbar
- Hero
- MapView
- ListView
- SearchBar
- ResourceCard
- AddResourceModal
- CategoryFilter
- AccessFilter
- Footer

### Custom Hooks

- useResources
- useGeolocation
- useTheme
- useDebouncedValue

---

## Performance Optimizations

NeighborNet incorporates several modern optimization techniques:

- Lazy-loaded routes and components
- Code splitting with React.lazy()
- Suspense boundaries
- React 19 transitions
- Memoized computations using useMemo()
- Stable callbacks with useCallback()
- Debounced search input
- Virtualized rendering using React Virtuoso
- Idle-time component prefetching

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

### Start development server

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

> Add screenshots here.

- Home
- Interactive Map
- Resource List
- Dark Theme
- Add Resource Modal

---

## Future Improvements

- User authentication
- Resource reviews and ratings
- Favorites and bookmarks
- Offline support
- Progressive Web App
- Image uploads
- AI-powered recommendations
- Advanced filtering

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

<div align="center">

Built with React, TypeScript, Firebase, and Leaflet.

</div>
