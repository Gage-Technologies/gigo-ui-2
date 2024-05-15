'use client'
import dynamic from 'next/dynamic';

const Login = dynamic(() => import("@/components/Pages/Login/Login"), { ssr: false })

export default Login;