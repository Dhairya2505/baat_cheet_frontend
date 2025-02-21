"use client"

import { Suspense } from "react"
import Chat_Component from "@/components/chatcomponent"

export default function ChatPage() {

  return (
    <Suspense fallback={<div> Loading ... </div>}>
      <Chat_Component />
    </Suspense>
  )
}