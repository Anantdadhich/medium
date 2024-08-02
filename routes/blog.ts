import {  PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'

import { verify } from 'hono/jwt'
import { createPostInput, updatePostInput } from '@developer_king/common'

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables:{
        userId:string
    }
}>();


blogRouter.use('/*',async (c,next)=>{
  const header=c.req.header("authorization") ||"";

  const token=header.split(" ")[1]

 try {
     const user=await verify(header,c.env.JWT_SECRET)

  if(user){
    c.set("userId",user.id)
   await  next()
}
  else{
    c.status(403)
    return c.json({error:"you are not loged"})
  }

 } catch (error) {
     c.status(403)
    return c.json({error:"you are not loged"})
 }
})



blogRouter.post("/", async (c)=>{
 
    const body=await c.req.json()
    const authorId=c.get("userId")
   
     const success=createPostInput.safeParse(body)
 if(!success){
   c.status(411)
   return c.json({
    message:"failed"
   })
 }
  const prisma= new PrismaClient({
        datasourceUrl:c.env?.DATABASE_URL
    }).$extends(withAccelerate())


  const post=  await prisma.post.create({
        data:{
            title:body.title,
            content:body.content,
            authorId:authorId
        }
    })
    return c.json({
        id:post.id
    })
})

 

blogRouter.put("/",async (c)=>{
   const body=await c.req.json()

     const success=updatePostInput.safeParse(body)
 if(!success){
   c.status(411)
   return c.json({
    message:"failed"
   })
 }
     const prisma= new PrismaClient({
        datasourceUrl:c.env?.DATABASE_URL
    }).$extends(withAccelerate())


  const post=  await prisma.post.update({
    where:{
        id:body.id
    }  ,  
    
    data:{
            title:body.title,
            content:body.content,

        }
    })
    return c.json({
        id:post.id
    })
})
//at the bulk
blogRouter.get('/bulk',async (c)=>{
  
    const prisma=new PrismaClient({
        datasourceUrl:c.env?.DATABASE_URL
    }).$extends(withAccelerate())

    const posts=await prisma.post.findMany()

    return c.json({
        posts
    })
})





blogRouter.get("/:id",async (c)=>{
   const id= c.req.param("id")
    const prisma= new PrismaClient({
        datasourceUrl:c.env?.DATABASE_URL
    }).$extends(withAccelerate())


try {
      const post=  await prisma.post.findFirst({
       where:{
        id:id
       }
    })
    return c.json({
        id:post
    })
} catch (error) {
    c.status(411)
    return c.json({
        message:"error "
    })
}
})

