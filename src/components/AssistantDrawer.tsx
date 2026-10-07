import { Drawer, FlatButton, Message, MessageList } from '@shadeui/ui'
import { Send } from 'lucide-react'
import { useState } from 'react'
import { useProto, type ChatMsg } from '../state'

type Props = {
  open: boolean
  chat: ChatMsg[]
  onChatChange: (chat: ChatMsg[]) => void
  onClose: () => void
}

/** Panel del asistente, anclado dentro del marco del prototipo (Drawer en modo inline). */
export function AssistantDrawer({ open, chat, onChatChange, onClose }: Props) {
  const { view } = useProto()
  const [text, setText] = useState('')
  const msgs = chat.length ? chat : [{ t: 'Hola, Mila. ¿En qué te ayudo?' }]

  const send = () => {
    const v = text.trim()
    if (!v) return
    onChatChange([...chat, { me: true, t: v }, { t: '(respuesta de ejemplo)' }])
    setText('')
  }

  return (
    <div
      className={`absolute inset-y-0 right-0 z-20 flex max-w-full transition-[transform,visibility] duration-200 ${
        open ? 'visible translate-x-0' : 'invisible translate-x-full'
      } ${view === 'mobile' ? 'w-full' : 'w-[400px]'}`}
      aria-hidden={!open}
    >
      <Drawer
        inline
        open
        className="!h-full !w-full !max-w-none !rounded-none border-l border-line"
        title="Urdi"
        description="Tu asistente"
        size={view === 'mobile' ? 'mobile' : 'web'}
        showActions={false}
        onOpenChange={(o) => !o && onClose()}
      >
        <div className="flex h-full w-full flex-col">
          <MessageList className="flex-1">
            {msgs.map((m, i) => (
              <Message key={i} align={m.me ? 'end' : 'start'} tone={m.me ? 'sent' : 'received'} showAvatar={false}>
                {m.t}
              </Message>
            ))}
          </MessageList>
          <form
            className="mt-4 flex items-center gap-2 rounded-xl border border-line p-1.5 pl-3"
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Preguntale a Urdi…"
              className="min-w-0 flex-1 bg-transparent outline-none"
            />
            <FlatButton type="submit" iconOnly color="slate" size="sm" aria-label="Enviar" leftIcon={<Send size={16} />} />
          </form>
        </div>
      </Drawer>
    </div>
  )
}
