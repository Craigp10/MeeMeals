import type { Metadata } from "next";
import { UserProvider } from "@/context/user-context";
import { WindowSizeProvider } from "@/context/window-size-context";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.scss";
import "@/styles/glyphicons.scss";

export const metadata: Metadata = {
  title: "MeeMeals - Meal Planning Made Easy",
  description: "Plan your meals for the week with MeeMeals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <WindowSizeProvider>
            <div className="app">{children}</div>
          </WindowSizeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
