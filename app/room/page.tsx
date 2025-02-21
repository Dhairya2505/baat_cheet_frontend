import { Suspense } from "react"
import Room_Component from "@/components/roomcomponent"

export default function RoomPage() {

  return (
    <Suspense fallback={<div> Loading ... </div>}>
      <Room_Component />
    </Suspense>
  )
}
