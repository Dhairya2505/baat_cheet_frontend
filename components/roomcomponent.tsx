"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { BACKEND_CHAT_SERVER, BACKEND_URI } from "@/app/constants"
import axios from "axios"

export default function Room_Component() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [userName, setUsername] = useState("")
  const [chats, setChats] = useState<{[key: string]: string}[]>([])
  const [roomName, setRoomName] = useState("")
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const searchParams = useSearchParams()

  const room_id = searchParams.get("id")
  const room_name = searchParams.get("room_name");

  useEffect(() => {

    async function connectSocket(){
        const response = await axios.get(`${BACKEND_URI}/valid_token`,{
            withCredentials: true
        });
    
        if (!response.data.success) {
            router.push("/signin");
            return;
        }

        if(!room_id){
            router.push("/");
            return;
        }

        setUsername(response.data.data);
        if(room_name){
            setRoomName(room_name)
        }

        const newSocket = new WebSocket(BACKEND_CHAT_SERVER);
        
        newSocket.onopen = () => {
            const data = {
                event: "room-token",
                username: response.data.data,
                room_id,
                room_name
            }
            newSocket.send(JSON.stringify(data)); 
            

            const data2 = {
                event: "get-room-chats",
                room_id
            }
            newSocket.send(JSON.stringify(data2)); 
        };

        newSocket.onmessage = (message) => {
            const data = JSON.parse(message.data)
            switch (data.event) {
                case "recieve-room-chats":
                  setChats(data.chats)
                  break;
                
                case "recieve-room-message":
                    const room = data.roomID
                    const from = data._from;
                    const message = data.message;
                    if(room_id == room){
                        setChats((prevChats) => [...prevChats, {[from]: message}])
                    }

                default:
                  break;
              }

        }

        setSocket(newSocket)

        return () => {
            const data = {
            event: "close",
            username: userName,
            room_id
            }
            newSocket.send(JSON.stringify(data));
            newSocket.close();
        }


    }

    connectSocket();

    return () => {
        if(socket){
          const data = {
            event: "close",
            username: userName,
            room_id
          }
          socket.send(JSON.stringify(data));
          socket.close();
        }
    };

  }, [room_id, router, room_name, socket, userName])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message && socket && room_id && room_name) {
      const data = {
        event: "send-room-message",
        username: userName,
        room_id,
        room_name,
        message
      }
      socket.send(JSON.stringify(data))
      setMessage("")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans"
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="fixed w-full flex items-center h-16 bg-gray-800 z-10 border-b border-gray-700 shadow-md"
      >
        <Button variant="ghost" size="icon" className="ml-2" onClick={() => router.push("/")}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold ml-4">
          {roomName} <span className="text-sm text-gray-400 ml-2">{room_id}</span>
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-grow overflow-y-auto pt-20 pb-24 px-4"
      >
        <AnimatePresence>
          {chats.map((chatObj, index) => (
            Object.entries(chatObj).map(([key, message]) => {
                return <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`mb-4 ${key === userName ? "text-right" : "text-left"}`}
                >
                <div
                    className={`inline-block p-3 rounded-lg ${
                    key === userName ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-100"
                    }`}
                >
                    {key !== userName && <p className="font-semibold text-sm mb-1">{key}</p>}
                    <p>{message}</p>
                </div>
                </motion.div>
            })
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.form
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 w-full bg-gray-800 border-t border-gray-700 p-4"
        onSubmit={sendMessage}
      >
        <div className="flex space-x-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow bg-gray-700 text-gray-100 border-gray-600"
          />
          <Button type="submit" disabled={!message}>
            Send
          </Button>
        </div>
      </motion.form>
    </motion.div>
  )
}