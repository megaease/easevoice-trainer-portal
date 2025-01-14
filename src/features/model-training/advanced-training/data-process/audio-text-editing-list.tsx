import { useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import AudioPlayer from '@/components/audio-player'
import audioSrc from './test.mp3'

// 模拟数据，实际使用时应该从API获取
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

export default function AudioTextEditingList() {
  const [editedTexts, setEditedTexts] = useState<Record<number, string>>({})
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>(
    {}
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleTextChange = (id: number, newText: string) => {
    setEditedTexts((prev) => ({ ...prev, [id]: newText }))
  }

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setSelectedItems((prev) => ({ ...prev, [id]: checked }))
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    // 这里应该发送所有更新后的文本到后端
    await new Promise((resolve) => setTimeout(resolve, 1500)) // 模拟API调用

    mockData.forEach((item) => {
      if (selectedItems[item.id]) {
        console.log(
          `Saving item ${item.id} with text: ${editedTexts[item.id] || item.text}`
        )
      }
    })

    setIsSaving(false)
    toast({
      title: '保存成功',
      description: '所有选中的音频文本已更新。',
    })
  }

  return (
    <div className='p-4 h-full mb-20'>
      <div className='flex justify-between items-center gap-2'>
        <h2 className='text-lg font-semibold'>音频文本校对</h2>
        <Button onClick={handleSaveAll} disabled={isSaving} className='my-4'>
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
      </div>
      <div className='flex flex-col gap-4'>
        {mockData.map((item) => (
          <Card key={item.id} className='w-full shadow-none'>
            <CardContent className=' p-2'>
              <Checkbox
                checked={selectedItems[item.id] || false}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(item.id, checked as boolean)
                }
                className='mr-4'
              />
              <div className='flex-grow'>
                <AudioPlayer
                  audioState={{
                    url: item.url,
                    duration: item.duration,
                    name: item.name,
                  }}
                />
              </div>

              <div className='w-full'>
                <div className='text-gray-500 text-sm'>{item.name}</div>
                <Textarea
                  value={editedTexts[item.id] || item.text}
                  onChange={(e) => handleTextChange(item.id, e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
