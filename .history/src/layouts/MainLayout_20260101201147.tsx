import Header from '../components/common/Header';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
