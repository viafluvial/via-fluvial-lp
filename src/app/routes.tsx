import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { MissionPage } from "./pages/MissionPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { FAQPage } from "./pages/FAQPage";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import AdminDashboard from "./pages/AdminDashboard";
import TestDatabase from "./pages/TestDatabase";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "nossa-missao", Component: MissionPage },
      { path: "como-funciona", Component: HowItWorksPage },
      { path: "faq", Component: FAQPage },
      { path: "contato", Component: ContactPage },
      { path: "privacidade", Component: PrivacyPage },
      { path: "termos", Component: TermsPage },
    ],
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/test-database",
    Component: TestDatabase,
  },
]);