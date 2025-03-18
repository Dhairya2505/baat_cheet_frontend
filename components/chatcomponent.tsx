import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import axios from "axios"
import { BACKEND_URI, BACKEND_CHAT_SERVER } from "@/app/constants"

export default function Chat_Component () {
    
    const router = useRouter()
    const searchParams = useSearchParams()
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("")
    const [chats, setChats] = useState<{[key: string]: string}[]>([])
    const [socket, setSocket] = useState<WebSocket | null>(null)

    const ToUsername = searchParams.get("to")

    useEffect(() => {

        async function connectSocket(){
            const response = await axios.get(`${BACKEND_URI}/valid_token`,{
                withCredentials: true
            });
        
            if (!response.data.success) {
                router.push("/signin");
                return;
            }
    
            if (!(ToUsername)) {
              router.push("/")
              return;
            }
            setUsername(response.data.data);
            const newSocket = new WebSocket(BACKEND_CHAT_SERVER);
    
            newSocket.onopen = () => {
                const data = {
                    event: "token",
                    username: response.data.data
                }
                newSocket.send(JSON.stringify(data)); 
                
    
                const data2 = {
                  event: "get-chats",
                  from_user: response.data.data,
                  to_user: ToUsername
                }
                newSocket.send(JSON.stringify(data2)); 
              };
    
            newSocket.onmessage = (message) => {
                const data = JSON.parse(message.data)
                switch (data.event) {
                    case "recieve-chats":
                      setChats(data.chats)
                      break;
                    
                    case "recieve-chat":
                        const from = data.from;
                        const message = data.message;
                        if(from == ToUsername){
                          setChats((prevChats) => [...prevChats, {[from]: message}])
                        }
                        break;
    
                    default:
                      break;
                  }
    
            }
        
            setSocket(newSocket)
        
            return () => {
                const data = {
                  event: "close",
                  username
                }
                newSocket.send(JSON.stringify(data));
                newSocket.close();
            };
    
        }
        connectSocket();
        
        return () => {
          if(socket && socket.readyState == WebSocket.OPEN){
            const data = {
              event: "close",
              username
            }
            socket.send(JSON.stringify(data));
            socket.close();
          }
      };
    
      }, [ToUsername, username, router])
      
    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (message && socket) {
            const data = {
                event: "send-message",
                to: ToUsername,
                from: username,
                message
            }
            socket.send(JSON.stringify(data))
            setChats((prevChats) => [
            ...prevChats,
            { [username]: message },
            ])
            setMessage("")
        }
    }

    return <motion.div
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
        <h1 className="text-xl font-semibold ml-4">{ToUsername}</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-grow overflow-y-auto pt-20 pb-24 px-4"
      >
        <AnimatePresence>
          {chats.map((chat, index) => (
            Object.entries(chat).map(([user, msg]) => {
                return <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 ${user === username ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  user === username ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-100"
                }`}
              >
                {user !== username && (
                  <p className="font-semibold text-sm mb-1">{user}</p>
                )}
                <p>{msg}</p>
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
}