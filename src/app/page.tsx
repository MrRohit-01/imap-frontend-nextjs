'use client'

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getMessages from "./actions/getMessages";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "dompurify";

interface EmailAddress {
  name: string;
  address: string;
  _id: string;
}

interface Message {
  subject: string;
  date: string;
  messageId: string;
  body: string;
  replyTo: EmailAddress[];
  to: EmailAddress[];
  from: EmailAddress[];
  sender: EmailAddress[];
  attachments: any[];
  _id: string;
  __v: number;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const msgs = await getMessages();
      setMessages(msgs || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchMessages();
  }, [status]);

  if (status === "loading") return <div className="p-6 text-gray-600">Loading session...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-blue-600 text-white transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:flex flex-col`}>
        <div className="px-6 py-4 border-b border-blue-500 flex items-center justify-between">
          <h1 className="text-xl font-semibold">MailDesk</h1>
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button className="w-full text-left px-3 py-2 rounded-md bg-blue-700 font-medium truncate">
            Inbox
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-500 transition truncate">
            Sent
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-500 transition truncate">
            Drafts
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-500 transition truncate">
            Trash
          </button>
        </nav>

        <div className="px-4 py-3 border-t border-blue-500 text-sm truncate">
          <div>{session?.user?.name || "Guest"}</div>
          <div className="text-blue-200 truncate">{session?.user?.email}</div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="h-16 flex items-center justify-between border-b px-4 md:px-6 bg-white sticky top-0 z-10">
          <button
            className="md:hidden text-blue-700 font-semibold"
            onClick={() => setSidebarOpen(true)}
          >
            ☰ Menu
          </button>
          <div className="text-lg font-semibold text-blue-700 truncate">Inbox</div>
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {/* Message List */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {loading && <div className="text-gray-600">Loading messages...</div>}
          {!loading && messages.length === 0 && (
            <div className="text-gray-500 mt-8 text-center">No messages yet.</div>
          )}

          {messages.map((msg, index) => (
            <div
  key={msg._id || index}
  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer p-4 w-full max-w-xl"
>
  {/* Subject + info */}
  <div className="flex justify-between items-start flex-wrap">
    <div className="max-w-[70%]">
      <h2 className="text-base font-semibold text-blue-700 truncate max-w-full">
        {msg.subject}
      </h2>
      <p className="text-sm text-gray-600 truncate max-w-full">
        {msg.from?.[0]?.address || "Unknown"} → {msg.to?.[0]?.address || "Unknown"}
      </p>
    </div>
    <p className="text-xs text-gray-500 mt-1 md:mt-0">
      {new Date(msg.date).toLocaleString()}
    </p>
  </div>

  {/* Body preview */}
  <div className="mt-2 text-gray-800 break-words whitespace-pre-wrap leading-relaxed max-w-full
                  max-h-40 overflow-hidden line-clamp-5">
    <div
      className="prose max-w-full"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(msg.body, {
          ADD_TAGS: ["img", "button", "table", "tbody", "tr", "td", "th", "a"],
          ADD_ATTR: ["target", "class", "style", "src", "href"]
        })
      }}
    />
  </div>
</div>

          ))}
        </main>
      </div>
    </div>
  );
}
