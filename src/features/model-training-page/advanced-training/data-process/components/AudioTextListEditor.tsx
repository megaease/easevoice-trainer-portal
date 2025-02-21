import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { Loader2, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
  sourceDir: string
  outputDir: string
  refresh: () => void
}

type AudioTextItemProps = {
  filePath: string
  data: AudioFileData
  onDelete: (filePath: string) => void
  onSave?: (data: AudioFileData) => Promise<any>
}

function AudioTextItem({
  filePath,
  data,
  onDelete,
  onSave,
}: AudioTextItemProps) {
  const [editedText, setEditedText] = useState(data.text_content)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    onSave &&
      onSave({
        ...data,
        text_content: editedText,
      }).finally(() => {
        setIsSaving(false)
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
          name={data.source_file_path.split('/').pop() || ''}
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <Trash2 className='mr-2 h-4 w-4' />
                删除
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                确定要删除这个项目吗？此操作无法撤销。
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onDelete(filePath)
                  }}
                >
                  删除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AudioTextListEditor({
  data = {},
  sourceDir,
  outputDir,
  refresh,
}: AudioTextListEditorProps) {
  const handleDelete = (filePath: string) => {
    deleteMutation.mutate(filePath)
  }
  const deleteMutation = useMutation({
    mutationFn: async (filePath: string) => {
      const res = await trainingApi.deleteRefinement({
        source_dir: sourceDir,
        output_dir: outputDir,
        source_file_path: filePath,
      })
      return res.data
    },
    onSuccess: () => {
      toast('删除成功', {
        description: `已成功删除项目`,
      })
    },
  })
  const saveMutation = useMutation({
    mutationFn: async (data: AudioFileData) => {
      const res = await trainingApi.updateRefinement({
        ...data,
        source_dir: sourceDir,
        output_dir: outputDir,
      })
      return res.data
    },
    onSuccess: (data) => {
      console.log('data', data)
      toast('保存成功', {
        description: `已成功保存更改`,
      })
      refresh()
    },
    onError: () => {
      toast('保存失败', {
        description: '保存更改时出错，请稍后再试',
      })
    },
  })
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
              onSave={saveMutation.mutateAsync}
            />
          ))}
      </div>
    </div>
  )
}
