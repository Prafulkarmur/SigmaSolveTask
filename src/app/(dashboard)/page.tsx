'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Home() {
    const [blogPosts, setBlogPosts] = useState([])
    console.log("🚀 ~ Blog ~ blogPosts:", blogPosts)
    useEffect(() => {
        fetch('/api/allblogs')
            .then(response => response.json())
            .then(data => setBlogPosts(data?.blogs || []))
            .catch(error => console.error(error))
    }, [])
    return (
        <div className='container px-4'>
            Blogs
            <div className='flex flex-col  md:flex-row mt-4'>
            {blogPosts.map((post: any) => (
                <Card key={post._id}>
                    <CardHeader>
                        <CardTitle>{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {post.description}
                    </CardContent>
                </Card>
            ))}
            </div>

            <Button className="mt-5">
                <Link href={"/create-blog"}>
                Create a new Blog</Link>
            </Button>
        </div>
    )
}
