"use client"
import Link from 'next/link'
import React from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Button } from '../ui/button'
import { signOut, useSession } from 'next-auth/react'

export default function Header() {
    const [isOpen, setIsOpen] = React.useState(false)
    const { status } = useSession()

    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: "/" });
    }
    const navigation = [
        { name: "Home", href: "/" },
        { name: "Create Blog", href: "/create-blog" },
        { name: "Create Category", href: "/create-category" },
    ]
    return (
        <header className="bg-gray-500 z-50 w-full">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center text-white">
                        <svg
                            className="h-6 w-6 mr-2"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                        </svg>
                        Sigma
                    </Link>

                    {/* Desktop Navigation */}

                    <div className="hidden md:flex items-center gap-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-white/90 hover:text-white transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                        {status === "authenticated" && <Button onClick={handleLogout}>
                            logout
                        </Button>}


                        {/* Auth Buttons */}
                        {status !== "authenticated" && <>  <Button variant="default" className="text-white rounded-full">
                            Log In
                        </Button>
                            <Button variant="outline" className="text-white bg-secondary rounded-full">
                                Sign up
                            </Button>
                        </>}
                    </div>

                    {/* Mobile Menu Trigger */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" className="md:hidden text-white">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full bg-[#1a1f36] p-0">
                            <DialogTitle className="sr-only">Menu</DialogTitle>
                            <div className="flex flex-col h-full">
                                <div className="p-4 flex justify-between items-center border-b border-slate-700">
                                    <Link href="/" className="flex items-center text-white" onClick={() => setIsOpen(false)}>
                                        <svg
                                            className="h-6 w-6 mr-2"
                                            fill="none"
                                            height="24"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                                        </svg>
                                        Askitect
                                    </Link>
                                    <Button variant="ghost" className="text-white" onClick={() => setIsOpen(false)}>
                                        <X className="h-6 w-6" />
                                    </Button>
                                </div>
                                <div className="flex-1 overflow-auto py-4">
                                    <nav className="flex flex-col space-y-4">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="text-white/90 hover:text-white px-4 py-2 transition-colors"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                                {
                                    status !== "authenticated" &&
                                    <div className="p-4 border-t border-slate-700 space-y-4">
                                        <Button className="w-full text-white rounded-full">
                                            Log In
                                        </Button>
                                        <Button variant="outline" className="w-full bg-secondary rounded-full text-white">
                                            Sign up
                                        </Button>
                                    </div>
                                }

                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    )
}
