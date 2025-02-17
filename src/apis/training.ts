import apiClient from '@/lib/apiClient'

class trainingApi {
  async startTraining(data: { source_dir: string }) {
    return await apiClient.post(`/easevoice/start`, data)
  }

  async getTrainingStatus() {
    return await apiClient.get(`/easevoice/status`)
  }

  async stopTraining() {
    return await apiClient.post(`/easevoice/stop`)
  }

  async startVoiceExtraction(data: {
    source_dir: string
    output_dir: string
    model_name: string
    audio_format: string
  }) {
    return await apiClient.post(`/audio/uvr5/start`, data)
  }

  async getVoiceExtractionStatus() {
    return await apiClient.get(`/audio/uvr5/status`)
  }

  async stopVoiceExtraction() {
    return await apiClient.post(`/audio/uvr5/stop`)
  }

  async startVoiceSlicing(data: {
    source_dir: string
    output_dir: string
    threshold: number
    min_length: number
    min_interval: number
    hop_size: number
    max_silent_kept: number
    normalize_max: number
    alpha_mix: number
    num_process: number
  }) {
    return await apiClient.post(`/audio/slicer/start`, data)
  }

  async getVoiceSlicingStatus() {
    return await apiClient.get(`/audio/slicer/status`)
  }

  async stopVoiceSlicingStatus() {
    return await apiClient.post(`/audio/slicer/stop`)
  }

  async startAudioDenoising(data: { source_dir: string; output_dir: string }) {
    return await apiClient.post(`/audio/denoise/start`, data)
  }

  async getAudioDenoisingStatus() {
    return await apiClient.get(`/audio/denoise/status`)
  }

  async stopAudioDenoising() {
    return await apiClient.post(`/audio/denoise/stop`)
  }

  async startAudioTranscription(data: {
    source_dir: string
    output_dir: string
    asr_model: string
    model_size: string
    language: string
    precision: string
  }) {
    return await apiClient.post(`/audio/asr/start`, data)
  }

  async getAudioTranscriptionStatus() {
    return await apiClient.get(`/audio/asr/status`)
  }

  async stopAudioTranscription() {
    return await apiClient.post(`/audio/asr/stop`)
  }

  async getRefinementList(query: { input_dir: string; output_dir: string }) {
    return await apiClient.get(`/audio/refinement`, { params: query })
  }

  async updateRefinement(data: {
    source_dir: string
    output_dir: string
    source_file_path: string
    language: string
    text_content: string
  }) {
    return await apiClient.post(`/audio/refinement`, data)
  }

  async deleteRefinement(data: {
    source_dir: string
    output_dir: string
    source_file_path: string
  }) {
    return await apiClient.delete(`/audio/refinement`, { data })
  }

  async startNormalization(data: { output_dir: string }) {
    return await apiClient.post(`/normalize/start`, data)
  }

  async getNormalizationStatus() {
    return await apiClient.get(`/normalize/status`)
  }

  async stopNormalization() {
    return await apiClient.post(`/normalize/stop`)
  }

  async startSovitsTraining(data: {
    batch_size: number
    total_epochs: number
    text_low_lr_rate: number
    pretrained_s2G: string
    pretrained_s2D: string
    if_save_latest: boolean
    if_save_every_weights: boolean
    save_every_epoch: number
    gpu_ids: string
    train_input_dir: string
    output_model_name: string
  }) {
    return await apiClient.post(`/train/sovits`, data)
  }

  async getSovitsTrainingStatus() {
    return await apiClient.get(`/train/sovits/status`)
  }

  async stopSovitsTraining() {
    return await apiClient.post(`/train/sovits/stop`)
  }

  async startGptTraining(data: {
    batch_size: number
    total_epochs: number
    save_every_epoch: number
    if_dpo: boolean
    if_save_latest: boolean
    if_save_every_weights: boolean
    gpu_ids: string
    model_path: string
    train_input_dir: string
    normalize_path: string
    output_model_name: string
  }) {
    return await apiClient.post(`/train/gpt/start`, data)
  }

  async getGptTrainingStatus() {
    return await apiClient.get(`/train/gpt/status`)
  }

  async stopGptTraining() {
    return await apiClient.post(`/train/gpt/stop`)
  }
}

export default new trainingApi()
