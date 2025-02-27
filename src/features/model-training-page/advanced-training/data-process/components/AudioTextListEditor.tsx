import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { cn } from '@/lib/utils'

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
  const [isEdited, setIsEdited] = useState(false)

  useEffect(() => {
    setEditedText(data.text_content)
    setIsEdited(false)
  }, [data.text_content])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setEditedText(newText)
    setIsEdited(newText !== data.text_content)
  }

  const handleSave = async () => {
    if (!onSave || !isEdited) return
    
    try {
      setIsSaving(true)
      await onSave({
        ...data,
        text_content: editedText,
      })
      setIsEdited(false)
    } catch (error) {
      toast.error('保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <Card className='shadow-none'>
      <CardContent className='p-6 space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>
            {data.source_file_path.split('/').pop()}
          </h3>
          {isEdited && (
            <span className='text-sm text-yellow-600 dark:text-yellow-400'>
              有未保存的更改
            </span>
          )}
        </div>
        
        <AudioPlayerWithFetchData
          filePath={data.source_file_path}
          name={data.source_file_path.split('/').pop() || ''}
        />
        
        <Textarea
          value={editedText}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          className={cn('mt-2', {
            'border-yellow-500': isEdited
          })}
          rows={3}
          placeholder='请输入文本内容'
        />
        
        <div className='flex justify-end space-x-2'>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !isEdited}
          >
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
                {isEdited && '当前有未保存的更改，删除后将丢失。'}
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(filePath)}
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
  const queryClient = useQueryClient()
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
    onSuccess: async() => {
      toast.success('删除成功', {
        description: `已成功删除项目`,
      })
      await queryClient.invalidateQueries({ queryKey: ['refinementList'] })
      await refresh()
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
    onSuccess: () => {
      toast.success('保存成功', {
        description: `已成功保存更改`,
      })
      refresh()
      queryClient.invalidateQueries({ queryKey: ['refinementList'] })
    },
    onError: () => {
      toast.error('保存失败', {
        description: '保存更改时出错，请稍后再试',
      })
    },
  })

  const reloadMutation = useMutation({
    mutationFn: async () => {
      const res = await trainingApi.reloadRefinement({
        source_dir: sourceDir,
        output_dir: outputDir,
      })
      return res.data
    },
    onSuccess: async () => {
      toast.success('恢复成功', {
        description: `已成功恢复数据`,
      })
      await queryClient.invalidateQueries({ queryKey: ['refinementList'] })
      await refresh()
    },
    onError: () => {
      toast.error('恢复失败', {
        description: '恢复时出错，请稍后再试',
      })
    },
  })

  return (
    <div className='container mx-auto space-y-4 mt-4'>
      <div className='flex justify-end w-full'>
        <Button
          onClick={() => {
            reloadMutation.mutateAsync()
          }}
          variant={'outline'}
        >
          恢复数据
        </Button>
      </div>
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
