import React from "react";
import { Hero } from "./components/Hero";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { HowItWorks } from "./components/HowItWorks";
import { Testimonials } from "./components/Testimonials";
import { Footer } from "./components/Footer";

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-primary">
            <Hero />
            <FeaturesGrid />
            <HowItWorks />
            {/* <Testimonials /> */}
            <Footer />
        </div>
    );
};

export default LandingPage;
