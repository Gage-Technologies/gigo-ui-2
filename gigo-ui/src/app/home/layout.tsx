'use client'
import 'typeface-poppins';
import "./globals.css";
import {Provider} from "react-redux";
import {store} from "@/reducers/store";



export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <Provider store={store}>
        <html lang="en" >
          <body>{children}</body>
        </html>
      </Provider>
  );
}
