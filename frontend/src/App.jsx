import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { servicesData } from './data/servicesData';
import ProtectedRoute from './routes/ProtectedRoute';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import { RouteLoadingState } from './Components/LoadingStates';

const Home = lazy(() => import('./pages/Home'));
const Storyline = lazy(() => import('./pages/Storyline'));
const Plans = lazy(() => import('./pages/Plans'));
const Highlights = lazy(() => import('./pages/Highlights'));
const Auth = lazy(() => import('./pages/Auth'));
const Profile = lazy(() => import('./pages/Profile'));
const Policy = lazy(() => import('./pages/Policy'));
const Credits = lazy(() => import('./pages/Credits'));
const PayHistory = lazy(() => import('./pages/Payhistory.jsx'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const AdminDashboard = lazy(() => import('./Components/Admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));

const App = () => {
  return (
    <>
      <Helmet>
        <title>Aviyukt NGO | Top NGO in Bhopal, MP, India</title>
        <meta name="description" content="Aviyukt NGO is a leading non-profit organization in Bhopal, Madhya Pradesh, dedicated to empowering communities and creating a positive impact." />
      </Helmet>
      <Navbar />
      <Suspense fallback={<RouteLoadingState label="Loading Aviyukt page" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/storyline" element={<Storyline />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/highlights" element={<Highlights />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/policy" element={<Policy />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/payhistory" element={<PayHistory />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          {servicesData.map((service) => (
            <Route
              key={service.slug}
              path={`/services/${service.slug}`}
              element={<ServiceDetail serviceSlug={service.slug} />}
            />
          ))}
          <Route path="/services/:slug" element={<ServiceDetail />} />
        </Routes>
      </Suspense>
      <Footer/>
    </>
  );
};

export default App;
