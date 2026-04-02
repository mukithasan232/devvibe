import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "DevVibe Clothing | Premium Developer Tees",
    description: "Boost your coding flow with DevVibe's premium organic tees built for developers.",
    openGraph: {
      title: "DevVibe Clothing | Premium Developer Tees",
      description: "Boost your coding flow with DevVibe's premium organic tees.",
      url: "https://devvibe.com",
      siteName: "DevVibe Clothing",
      images: [{ url: "https://devvibe.com/og-image.jpg", width: 1200, height: 630 }],
      type: "website",
    },
  };
}

export default function Home() {
  return <HomeClient />;
}
