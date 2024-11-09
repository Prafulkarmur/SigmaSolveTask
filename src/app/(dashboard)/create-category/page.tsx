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
    const [error, setError] = useState('')
    const router = useRouter();

    const { data }: any = useSession();
    const { id: userId } = data?.user || {}

    const handleCreateBlog = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        if (!title || !content) {
            return setError("All fields are required")
        }
        const newCategory = { title, description: content }
        const response = await fetch(`/api/categories?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCategory),
        })
        const data = await response.json()
        if (response.ok) {
            // redirect to the blog detail page
            router.push("/")
            alert("Category created successfully")
        } else {
            setError(data.error || "An error occurred")
        }
        setLoading(false)
    }

    return (
        <div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Card>
                <CardHeader>
                    <CardTitle> Create a New Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateBlog} >
                        <label>
                            Title:
                            <Input type="text" name="title" onChange={(e) => setTitle(e.target.value)} />
                        </label>
                        <label>
                            Content:
                            <Textarea name="content" onChange={(e) => setContent(e.target.value)} />
                        </label>

                        <Button type="submit" disabled={loading} className='mt-6'>
                            Create Category
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
