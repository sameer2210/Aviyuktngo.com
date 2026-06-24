import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { servicesData } from './data/servicesData';
import ProtectedRoute from './routes/ProtectedRoute';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';

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

const RouteFallback = () => (
  <div className="min-h-[60vh] w-full bg-[#ebebeb] p-6 md:p-10">
    <div className="h-10 w-56 rounded-lg bg-slate-200/90 animate-pulse mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-56 rounded-2xl bg-slate-200/80 animate-pulse" />
      <div className="h-56 rounded-2xl bg-slate-200/80 animate-pulse" />
    </div>
    <div className="h-40 mt-6 rounded-2xl bg-slate-200/70 animate-pulse" />
  </div>
);

const App = () => {
  return (
    <>
      <Helmet>
        <title>Aviyukt NGO | Top NGO in Bhopal, MP, India</title>
        <meta name="description" content="Aviyukt NGO is a leading non-profit organization in Bhopal, Madhya Pradesh, dedicated to empowering communities and creating a positive impact." />
      </Helmet>
      <Navbar />
      <Suspense fallback={<RouteFallback />}>
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
