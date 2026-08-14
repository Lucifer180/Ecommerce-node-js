import { Outlet, ScrollRestoration } from "react-router-dom";

import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

const MainLayout = () => (
    <div className="flex min-h-screen flex-col bg-primary">
        <Header />
        <main className="flex-1">
            <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
    </div>
);

export default MainLayout;
