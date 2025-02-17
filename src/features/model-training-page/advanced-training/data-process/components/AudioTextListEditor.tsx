'use client'

import { useState } from 'react'
import { Loader2, RefreshCcw, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import audioSrc from '@/assets/test.mp3'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import AudioPlayer from '@/components/audio-player'

// Simulated data, in real use this should be fetched from an API
const mockData = [
  {
    id: 1,
    url: audioSrc,
    text: '这是第一段音频的文本。',
    duration: '1:23',
    name: 'audio1.mp3',
  },
  {
    id: 2,
    url: audioSrc,
    text: '这是第二段音频的文本。',
    duration: '2:34',
    name: 'audio2.mp3',
  },
  {
    id: 3,
    url: audioSrc,
    text: '这是第三段音频的文本。',
    duration: '3:45',
    name: 'audio3.mp3',
  },
  {
    id: 4,
    url: audioSrc,
    text: '这是第四段音频的文本。',
    duration: '4:56',
    name: 'audio4.mp3',
  },
  {
    id: 5,
    url: audioSrc,
    text: '这是第五段音频的文本。',
    duration: '5:67',
    name: 'audio5.mp3',
  },
]

export default function AudioTextListEditor() {
  const [editedTexts, setEditedTexts] = useState<Record<number, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [data, setData] = useState(mockData)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)

  const handleTextChange = (id: number, newText: string) => {
    setEditedTexts((prev) => ({ ...prev, [id]: newText }))
  }

  const handleSave = async (id: number) => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log(
      `Saving item ${id} with text: ${editedTexts[id] || data.find((item) => item.id === id)?.text}`
    )

    setIsSaving(false)
    toast('保存成功', {
      description: `已成功保存更改 (ID: ${id})`,
    })
  }

  const handleReset = () => {
    setEditedTexts({})
    toast('数据已恢复', {
      description: '已恢复到初始状态',
    })
  }

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id))
    setItemToDelete(null)
    toast('删除成功', {
      description: `已成功删除 (ID: ${id})`,
    })
  }

  return (
    <div className='container mx-auto space-y-4 mt-4'>
      <div className='flex justify-end'>
        <Button onClick={handleReset} variant='outline'>
          <RefreshCcw className='mr-2 h-4 w-4' />
          恢复数据
        </Button>
      </div>

      <div className='space-y-4'>
        {data.map((item) => (
          <Card key={item.id} className='shadow-none'>
            <CardContent className='p-6 space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>{item.name}</h3>
              </div>
              <AudioPlayer
                audioState={{
                  url: item.url,
                  duration: item.duration,
                  name: item.name,
                }}
              />
              <Textarea
                value={editedTexts[item.id] || item.text}
                onChange={(e) => handleTextChange(item.id, e.target.value)}
                className='mt-2'
                rows={3}
              />
              <div className='flex justify-end space-x-2'>
                <Button onClick={() => handleSave(item.id)} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className='mr-2 h-4 w-4' />
                      保存
                    </>
                  )}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant='destructive'
                      onClick={() => setItemToDelete(item.id)}
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      删除
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>确认删除</DialogTitle>
                    <DialogDescription>
                      确定要删除这个项目吗？此操作无法撤销。
                    </DialogDescription>
                    <DialogFooter>
                      <Button
                        variant='outline'
                        onClick={() => setItemToDelete(null)}
                      >
                        取消
                      </Button>
                      <Button
                        variant='destructive'
                        onClick={() => handleDelete(item.id)}
                      >
                        删除
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
