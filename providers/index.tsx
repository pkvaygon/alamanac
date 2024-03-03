"use client";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {ThemeProvider as NextThemesProvider} from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    return (
        <NextUIProvider navigate={router.push}>
           <NextThemesProvider enableColorScheme enableSystem attribute="class" defaultTheme="light">
        {children}
      </NextThemesProvider>
    </NextUIProvider>
    
        )

}