import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { Loader2, RefreshCcw, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
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
import AudioPlayerWithFetchData from './AudioPlayerWithFetchData'

type AudioFileData = {
  source_file_path: string
  language: string
  text_content: string
}

type AudioFiles = {
  [filePath: string]: AudioFileData
}

type AudioTextListEditorProps = {
  data: AudioFiles
  onSave?: (filePath: string, text: string) => void
}

type AudioTextItemProps = {
  filePath: string
  data: AudioFileData
  onDelete: (filePath: string) => void
  onSave?: (filePath: string, text: string) => void
}

function AudioTextItem({
  filePath,
  data,
  onDelete,
  onSave,
}: AudioTextItemProps) {
  const [editedText, setEditedText] = useState(data.text_content)
  const [isSaving, setIsSaving] = useState(false)

  const saveMutation = useMutation({
    mutationFn: async ({
      filePath,
      text,
    }: {
      filePath: string
      text: string
    }) => {
      const res = await trainingApi.saveAudioText({ filePath, text })
      return res.data
    },
    onSuccess: () => {
      toast('保存成功', {
        description: `已成功保存更改 (File: ${filePath})`,
      })
      if (onSave) {
        onSave(filePath, editedText)
      }
    },
    onError: () => {
      toast('保存失败', {
        description: '保存更改时出错，请稍后再试',
      })
    },
    onSettled: () => {
      setIsSaving(false)
    },
  })

  const handleSave = () => {
    setIsSaving(true)
    saveMutation.mutate({
      filePath,
      text: editedText,
    })
  }

  return (
    <Card key={filePath} className='shadow-none'>
      <CardContent className='p-6 space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>
            {data.source_file_path.split('/').pop()}
          </h3>
        </div>
        <AudioPlayerWithFetchData
          filePath={data.source_file_path}
          name={data.source_file_path.split('/').pop()}
        />
        <Textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className='mt-2'
          rows={3}
        />
        <div className='flex justify-end space-x-2'>
          <Button onClick={handleSave} disabled={isSaving}>
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
              <Button variant='destructive' onClick={() => onDelete(filePath)}>
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
                <Button variant='outline' onClick={() => onDelete(null)}>
                  取消
                </Button>
                <Button
                  variant='destructive'
                  onClick={() => onDelete(filePath)}
                >
                  删除
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AudioTextListEditor({
  data = {},
  onSave,
}: AudioTextListEditorProps) {
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const handleDelete = (filePath: string) => {
    delete data[filePath]
    setItemToDelete(null)
    toast('删除成功', {
      description: `已成功删除 (File: ${filePath})`,
    })
  }

  return (
    <div className='container mx-auto space-y-4 mt-4'>
      <div className='space-y-4'>
        {data &&
          Object.keys(data).map((filePath) => (
            <AudioTextItem
              key={filePath}
              filePath={filePath}
              data={data[filePath]}
              onDelete={handleDelete}
              onSave={onSave}
            />
          ))}
      </div>
    </div>
  )
}
