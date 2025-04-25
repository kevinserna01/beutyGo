import type { OnboardingSlide } from '~/types'

export const useOnboardingStore = defineStore('onboarding', () => {
  // Estado
  const slides = ref<OnboardingSlide[]>([
    {
      id: 1,
      title: 'Descubre la belleza',
      description: 'Explora un amplio catálogo de profesionales de belleza y servicios cerca de ti.',
      image: '/images/onboarding/discover.svg'
    },
    {
      id: 2,
      title: 'Reserva fácilmente',
      description: 'Agenda citas con tus profesionales favoritos en pocos pasos.',
      image: '/images/onboarding/booking.svg'
    },
    {
      id: 3,
      title: 'Servicio a domicilio',
      description: 'Recibe atención profesional en la comodidad de tu hogar.',
      image: '/images/onboarding/home.svg'
    }
  ])
  
  const currentSlideIndex = ref(0)
  const hasCompletedOnboarding = ref(false)
  
  // Getters
  const currentSlide = computed(() => slides.value[currentSlideIndex.value])
  const isLastSlide = computed(() => currentSlideIndex.value === slides.value.length - 1)
  
  // Acciones
  function nextSlide() {
    if (currentSlideIndex.value < slides.value.length - 1) {
      currentSlideIndex.value++
    } else {
      completeOnboarding()
    }
  }
  
  function previousSlide() {
    if (currentSlideIndex.value > 0) {
      currentSlideIndex.value--
    }
  }
  
  function goToSlide(index: number) {
    if (index >= 0 && index < slides.value.length) {
      currentSlideIndex.value = index
    }
  }
  
  function completeOnboarding() {
    hasCompletedOnboarding.value = true
    if (process.client) {
      try {
        localStorage.setItem('onboardingCompleted', 'true')
      } catch (e) {
        console.error('Error al guardar en localStorage:', e)
      }
    }
  }
  
  function checkOnboardingStatus() {
    if (process.client) {
      try {
        const status = localStorage.getItem('onboardingCompleted')
        hasCompletedOnboarding.value = status === 'true'
      } catch (e) {
        console.error('Error al leer de localStorage:', e)
      }
    }
  }
  
  // Inicializar - utilizamos onMounted para asegurarnos de que se ejecute solo en el cliente
  if (import.meta.client) {
    // Se ejecutará cuando el store se use en el cliente
    nextTick(() => {
      checkOnboardingStatus()
    })
  }
  
  return {
    slides,
    currentSlideIndex,
    hasCompletedOnboarding,
    currentSlide,
    isLastSlide,
    nextSlide,
    previousSlide,
    goToSlide,
    completeOnboarding,
    checkOnboardingStatus
  }
}) 