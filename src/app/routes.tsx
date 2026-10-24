import { createBrowserRouter, redirect } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { MissionPage } from "./pages/MissionPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { FAQPage } from "./pages/FAQPage";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";

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
      // Endereços antigos (como /admin e /test-database, removidos) e desconhecidos voltam para a página inicial.
      { path: "*", loader: () => redirect("/") },
    ],
  },
]);