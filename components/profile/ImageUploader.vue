<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string
  maxSizeKB?: number
  acceptedTypes?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  maxSizeKB: 5000, // 5MB por defecto
  acceptedTypes: () => ['image/jpeg', 'image/png', 'image/jpg']
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'error', message: string): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)
const isUploading = ref(false)
const isDragging = ref(false)
const errorMessage = ref<string | null>(null)

// Si ya hay una imagen, mostrarla en el preview
const currentImage = computed(() => props.modelValue || '/images/avatar-placeholder.png')

// Inicializar el preview con la imagen actual
onMounted(() => {
  previewUrl.value = props.modelValue || null
})

// Limpiar la URL del objeto cuando el componente se desmonta
onUnmounted(() => {
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

// Validar el archivo antes de procesarlo
const validateFile = (file: File): boolean => {
  errorMessage.value = null
  
  // Validar tipo de archivo
  if (!props.acceptedTypes.includes(file.type)) {
    errorMessage.value = `Tipo de archivo no permitido. Por favor usa: ${props.acceptedTypes.join(', ')}`
    emit('error', errorMessage.value)
    return false
  }
  
  // Validar tamaño
  if (file.size > props.maxSizeKB * 1024) {
    errorMessage.value = `La imagen es demasiado grande. El tamaño máximo es ${props.maxSizeKB / 1000}MB`
    emit('error', errorMessage.value)
    return false
  }
  
  return true
}

// Procesar el archivo seleccionado
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  
  const file = input.files[0]
  if (!validateFile(file)) return
  
  processFile(file)
}

// Procesar el archivo con la API FileReader
const processFile = (file: File) => {
  isUploading.value = true
  
  // Generar URL para preview
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = URL.createObjectURL(file)
  
  // Convertir a Base64 para enviar al servidor
  const reader = new FileReader()
  reader.readAsDataURL(file)
  
  reader.onload = () => {
    emit('update:modelValue', reader.result as string)
    isUploading.value = false
  }
  
  reader.onerror = () => {
    errorMessage.value = 'Error al procesar la imagen'
    emit('error', errorMessage.value)
    isUploading.value = false
  }
}

// Abrir el selector de archivos cuando se hace clic en el botón
const openFileInput = () => {
  fileInput.value?.click()
}

// Manejar eventos de drag and drop
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0]
    if (!validateFile(file)) return
    
    processFile(file)
  }
}
</script>

<template>
  <div class="image-uploader">
    <div 
      class="image-preview-container"
      :class="{ 'is-dragging': isDragging }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <div v-if="isUploading" class="uploading-overlay">
        <div class="spinner"></div>
        <p>Subiendo...</p>
      </div>
      
      <div class="image-preview">
        <img 
          :src="previewUrl || currentImage" 
          alt="Vista previa de imagen" 
          class="preview-img" 
        />
      </div>
      
      <div class="overlay">
        <button 
          type="button" 
          class="upload-btn"
          @click="openFileInput"
          :disabled="isUploading"
        >
          <span v-if="!previewUrl">Subir imagen</span>
          <span v-else>Cambiar imagen</span>
        </button>
        
        <p v-if="!previewUrl" class="drop-text">
          o arrastra y suelta una imagen aquí
        </p>
      </div>
    </div>
    
    <input
      ref="fileInput"
      type="file"
      class="file-input"
      @change="handleFileChange"
      accept="image/jpeg,image/png,image/jpg"
    />
    
    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.image-uploader {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.image-preview-container {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  border: 2px dashed #ccc;
  transition: all 0.3s ease;
}

.image-preview-container:hover .overlay,
.is-dragging .overlay {
  opacity: 1;
}

.is-dragging {
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.image-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-btn {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 8px;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: var(--color-primary-dark);
}

.upload-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.drop-text {
  color: white;
  font-size: 0.8rem;
  text-align: center;
  padding: 0 16px;
}

.file-input {
  display: none;
}

.error-message {
  color: #e53935;
  font-size: 0.85rem;
  margin-top: 8px;
  text-align: center;
}

.uploading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 