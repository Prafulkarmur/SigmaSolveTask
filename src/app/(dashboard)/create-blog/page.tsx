'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Category {
    id: number
    title: string
    // Add other properties as needed
}
export default function CreateBlog() {
    const [title, setTitle] = React.useState<string>('')
    const [content, setContent] = React.useState('')
    const [loading, setLoading] = useState(false)
    const [categoryId, setCategoryId] = useState("")
    const [categories, setCategories] = useState<Category[]>([])
    console.log("🚀 ~ CreateBlog ~ categories:", categories)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();

    const { data }: any = useSession();
    const { id: userId } = data?.user || {}

    const handleCreateBlog = async (e: any) => {
        e.preventDefault()
        if (!title ||!content ||!categoryId) {
            return setError("All fields are required")
        }
        setLoading(true)
        const newBlog = { title, description: content }
        const response = await fetch(`/api/blogs?categoryId=${categoryId}&userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBlog),
        })
        await response.json()
        if (response.ok) {
            // redirect to the blog detail page
            router.push(`/`)
        }
        setLoading(false)
    }

     const handleCategoryChange = (value: any) => {
        console.log("🚀 ~ handleCategoryChange ~ value:", value)
        setCategoryId(value)
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`api/categories?userId=${userId}`) // Replace with your actual API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch categories')
                }
                const data = await response.json()
                setCategories(data)
                setIsLoading(false)
            } catch (err) {
                setIsLoading(false)
            }
        }

        if (userId) {
            fetchCategories()
        }
    }, [userId])
    return (
        <div className='container px-4 mt-4 '>
            <Card>
            <CardHeader>
                        <CardTitle>  Create a New Blog</CardTitle>
                    </CardHeader>
                <CardContent>
            <form onSubmit={handleCreateBlog} className='space-y-5'>
                <label>
                    Title:
                    <Input type="text" name="title" onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label>
                    Content:
                    <Textarea name="content" onChange={(e) => setContent(e.target.value)} />
                </label>
                <label>
                    Category:
                    <Select onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                categories.map((category:any,index) => {
                                    return <SelectItem value={String(category?._id)} key={index}>{category?.title}</SelectItem>
                                })
                            }
                        </SelectContent>
                    </Select>
                </label>
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" className='mt-5' disabled={loading}>
                    Create Blog
                </Button>
            </form>
            </CardContent>
            </Card>
        </div>
    )
}
