import * as z from 'zod'

export const formSchema = z.object({
  text: z.string(),
  text_lang: z.string(),
  ref_audio_path: z.string(),
  prompt_text: z.string(),
  prompt_lang: z.string(),
  text_split_method: z.string(),
  aux_ref_audio_paths: z.array(z.string()).optional(),
  // seed: z.number().optional(),
  top_k: z.number().optional(),
  top_p: z.number().optional(),
  temperature: z.number().optional(),
  batch_size: z.number().optional(),
  speed_factor: z.number().optional(),
  ref_text_free: z.boolean().optional(),
  split_bucket: z.boolean().optional(),
  fragment_interval: z.number().optional(),
  keep_random: z.boolean().optional(),
  parallel_infer: z.boolean().optional(),
  repetition_penalty: z.number().optional(),
  sovits_path: z.string().optional(),
  gpt_path: z.string().optional(),
  output_dir: z.string(),
  project_dir: z.string(),
})

export type VoiceCloneFormData = z.infer<typeof formSchema>
