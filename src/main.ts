import './style.css'
import { mediaItems, type MediaItem } from './media.generated'

type Screen = 'intro' | 'drumroll' | 'reveal' | 'letter' | 'closing'

type LetterStep = {
  title: string
  text: string[]
  photo: number
  caption: string
}

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Elemento #app nao encontrado.')
}

const assetBase = import.meta.env.BASE_URL
const asset = (path: string) => `${assetBase}${path.split('/').map(encodeURIComponent).join('/')}`
const images = mediaItems.filter((item): item is MediaItem => item.type === 'image')

const letterSteps: LetterStep[] = [
  {
    title: 'Querida Mãezinha Adriana',
    photo: 4,
    caption: 'Um carinho que ficou marcado.',
    text: [
      'Feliz Dia das Mães! Quero aproveitar este dia especial para celebrar a mulher extraordinária que você é e desejar que o Senhor continue abençoando a sua vida com muita saúde, segurança e a companhia constante do Espírito Santo.',
      'Que todos os seus planos e desejos justos se realizem.',
    ],
  },
  {
    title: 'Uma luz admirável',
    photo: 5,
    caption: 'A sabedoria que acolhe e ilumina.',
    text: [
      'Admiro profundamente a sua sabedoria, a sua mente brilhante e a forma inspiradora com que você vive o evangelho.',
      'Você possui um dom raro: consegue unir uma inteligência admirável a um coração materno gigantesco, enxergando além das aparências e amando as pessoas com o puro amor de Cristo.',
      'É essa sua essência luminosa e dedicada que abençoa todos ao seu redor e que me inspira profundamente.',
    ],
  },
  {
    title: 'Quando cheguei a São Paulo',
    photo: 2,
    caption: 'Sob o teto de vocês, eu encontrei família.',
    text: [
      'Neste dia santo e especial, ao refletir sobre a minha jornada, minha gratidão transborda.',
      'Quando cheguei a São Paulo, deparei-me com incertezas e desafios que pareciam maiores do que eu poderia suportar.',
      'Lidar com o divórcio, o desemprego e tantas outras lutas estava sendo exaustivo, mas sob o teto de vocês encontrei muito mais do que um abrigo: fui recebido com o verdadeiro amor.',
    ],
  },
  {
    title: 'Uma família que me abraçou',
    photo: 3,
    caption: 'Nelson, Rafael e João também se tornaram parte desse abraço.',
    text: [
      'Ter você e o Nelson como grandes pilares, e ganhar o Rafael e o João como irmãos, fez com que esse acolhimento genuíno formasse uma verdadeira família, que me abraçou quando eu mais precisava de direção.',
    ],
  },
  {
    title: 'Clareza para enxergar o futuro',
    photo: 1,
    caption: 'Conversas, conselhos e uma mesa onde a vida voltava a fazer sentido.',
    text: [
      'Mais do que me acolher, você me ofereceu a sua visão de mundo.',
      'Foram as suas observações precisas, como mãe e como profissional, unidas à sabedoria do Nelson, que me trouxeram a clareza que há muito me faltava.',
      'Vocês não apenas me ajudaram a compreender a minha história e a organizar meus pensamentos, mas me devolveram a capacidade de enxergar o futuro. Onde havia escuridão, vocês acenderam uma luz.',
    ],
  },
  {
    title: 'Um ponto de virada',
    photo: 0,
    caption: 'Bondade prática, dessas que mudam o rumo de uma vida.',
    text: [
      'Ainda estou no processo de transformação, mas o ponto de virada que Deus me deu para mudar a minha vida veio através da bondade de vocês.',
      'Não é por acaso que recebem os carinhosos títulos de mãezinha e paizinho.',
      'Como o Élder Jeffrey R. Holland ensinou, não há amor na mortalidade que se aproxime mais do puro amor de Jesus Cristo do que o amor de uma mãe.',
      'E é exatamente esse amor compassivo e ativo que você exala na prática e que transborda para toda a família.',
    ],
  },
  {
    title: 'A paz para recomeçar',
    photo: 6,
    caption: 'A paz de um lar também constrói futuro.',
    text: [
      'Se hoje exerço a profissão que almejei e conquistei essa nova carreira, é porque o ambiente de paz e incentivo que você e o Nelson cultivam me ofereceu a estrutura para sentar, estudar e transformar o meu futuro.',
      'Sinto muita falta das nossas conversas interessantíssimas; sua inteligência, suas ideias e sua perspectiva de vida sempre expandiram a minha visão.',
      'Vocês acreditaram no meu potencial quando eu mesmo ainda tentava entendê-lo.',
    ],
  },
  {
    title: 'Evangelho, Templo e lar',
    photo: 2,
    caption: 'Um lar elevado pela fé e pelo serviço.',
    text: [
      'Seu profundo amor pelo evangelho e pelo Templo é uma das qualidades que mais admiro.',
      'Ter o privilégio de desfrutar do Templo e do Instituto a poucos passos de distância não era apenas uma facilidade geográfica, mas o reflexo da elevação espiritual que você e o Nelson estabeleceram e lideram dentro do lar.',
    ],
  },
  {
    title: 'O legado no João',
    photo: 3,
    caption: 'A força de uma família aparece nos frutos que ela oferece a Deus.',
    text: [
      'E, por falar em propósito sagrado, meu coração se enche de alegria e do Espírito Santo sempre que falo com o João.',
      'Vê-lo hoje servindo na mesma São Paulo Interlagos que tanto marcou a minha própria missão é a prova viva do legado de retidão que você construiu.',
      'A excelência do missionário que ele é reflete os pais extraordinários que o criaram.',
    ],
  },
  {
    title: 'Com amor e admiração',
    photo: 4,
    caption: 'Obrigado por me amar com cuidado de verdadeira mãe.',
    text: [
      'Mãezinha, sua generosidade, sua paciência e a sua mente brilhante consagrada a Deus são sementes que vejo germinar em mim todos os dias.',
      'Obrigado por ser uma inspiração contínua, pelos conselhos preciosos e por me amar com o cuidado de uma verdadeira mãe.',
      'Com todo o meu amor e profunda admiração,',
      'William',
    ],
  },
]

let screen: Screen = 'intro'
let activeLetterStep = 0
let zoomOpen = false
let immersiveOpen = false
let zoomLevel = 1
let revealTimer: number | null = null
let soundController: SoundController | null = null
let pendingZoomFocus: { x: number; y: number } | null = null
let panState:
  | {
      frame: HTMLElement
      pointerId: number
      startX: number
      startY: number
      scrollLeft: number
      scrollTop: number
    }
  | null = null

class SoundController {
  private readonly sounds = {
    drum: this.createAudio('audio/gift-drum-roll.mp3', 0.96),
    sparkle: this.createAudio('audio/magic-sparkle-whoosh.mp3', 0.82),
    reveal: this.createAudio('audio/happy-bells-notification.mp3', 0.78),
  }

  private revealTimers: number[] = []

  playGiftReveal() {
    this.clearRevealTimers()
    this.play('drum')
    this.queue('sparkle', 3440)
    this.queue('reveal', 3650)
  }

  private createAudio(path: string, volume: number) {
    const audio = new Audio(asset(path))
    audio.preload = 'auto'
    audio.volume = volume
    audio.load()
    return audio
  }

  private queue(sound: keyof SoundController['sounds'], delay: number) {
    this.revealTimers.push(window.setTimeout(() => this.play(sound), delay))
  }

  private clearRevealTimers() {
    this.revealTimers.forEach((timer) => window.clearTimeout(timer))
    this.revealTimers = []
  }

  private play(sound: keyof SoundController['sounds']) {
    const audio = this.sounds[sound]
    audio.currentTime = 0
    audio.play().catch(() => undefined)
  }
}

const getSound = () => {
  if (!soundController) soundController = new SoundController()
  return soundController
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const photoByIndex = (index: number) => (images.length > 0 ? images[index % images.length] : undefined)
const activeStep = () => letterSteps[activeLetterStep]
const activePhoto = () => photoByIndex(activeStep().photo)

const clearRevealTimer = () => {
  if (revealTimer !== null) {
    window.clearTimeout(revealTimer)
    revealTimer = null
  }
}

const requestNativeFullscreen = () => {
  window.requestAnimationFrame(() => {
    document.documentElement.requestFullscreen?.().catch(() => undefined)
  })
}

const openImmersive = () => {
  if (!activePhoto()) return
  zoomOpen = false
  immersiveOpen = true
  render()
  requestNativeFullscreen()
}

const closeImmersive = (shouldRender = true) => {
  immersiveOpen = false
  if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined)
  if (shouldRender) render()
}

const moveLetter = (direction: 1 | -1) => {
  activeLetterStep = Math.min(Math.max(activeLetterStep + direction, 0), letterSteps.length - 1)
  zoomOpen = false
  zoomLevel = 1
  render()
}

const previewPhotos = () => {
  const selected = images.length > 0 ? images.slice(0, 5) : []

  if (selected.length > 0) {
    return selected
      .map(
        (item, index) =>
          `<img class="floating-memory memory-${index + 1}" src="${asset(item.src)}" alt="" loading="eager" />`,
      )
      .join('')
  }

  return ['A', 'N', 'R', 'J', 'W']
    .map((letter, index) => `<span class="floating-memory placeholder-memory memory-${index + 1}">${letter}</span>`)
    .join('')
}

const renderIntro = () => `
  <main class="experience intro-screen">
    <div class="memory-field" aria-hidden="true">${previewPhotos()}</div>
    <section class="intro-content" aria-labelledby="intro-title">
      <p class="eyebrow">Feliz Dia das Mães</p>
      <h1 id="intro-title">Adriana</h1>
      <span>uma carta preparada com gratidão, carinho e saudade</span>
      <button type="button" data-action="start-surprise">Abrir presente</button>
    </section>
  </main>
`

const renderDrumroll = () => `
  <main class="experience drumroll-screen">
    <section class="gift-reveal" aria-live="polite">
      <p class="eyebrow">rufem os tambores...</p>
      <div class="big-gift" aria-hidden="true">
        <span class="big-gift-lid"></span>
        <span class="big-gift-box"></span>
        <span class="big-gift-ribbon"></span>
        ${Array.from({ length: 18 }, (_, index) => `<span class="burst-heart burst-${index + 1}"></span>`).join('')}
      </div>
      <h1>um presente feito de palavras e memória</h1>
    </section>
  </main>
`

const renderReveal = () => `
  <main class="experience reveal-screen">
    <section class="reveal-card">
      <p class="eyebrow">Para Mãezinha Adriana</p>
      <h1>Feliz Dia das Mães</h1>
      <p>Preparei uma carta para ser aberta com calma, acompanhada por lembranças de alguns momentos em que seu cuidado fez diferença na minha vida.</p>
      <button type="button" data-action="open-letter">Ler a carta</button>
    </section>
  </main>
`

const renderPhotoPanel = (step: LetterStep) => {
  const photo = photoByIndex(step.photo)

  if (!photo) {
    return `
      <aside class="letter-photo-panel empty-photo" aria-label="Memória da carta">
        <span>Adriana</span>
        <p>${step.caption}</p>
      </aside>
    `
  }

  return `
    <aside class="letter-photo-panel" aria-label="Memória da carta">
      <button class="letter-photo-button" type="button" data-action="open-zoom" aria-label="Ampliar foto deste trecho">
        <img src="${asset(photo.src)}" alt="${escapeHtml(step.caption)}" />
      </button>
      <div class="photo-caption">
        <p>${step.caption}</p>
        <div>
          <button class="photo-tool" type="button" data-action="open-zoom">Zoom</button>
          <button class="photo-tool" type="button" data-action="open-immersive">Tela cheia</button>
        </div>
      </div>
    </aside>
  `
}

const renderLetter = () => {
  const step = activeStep()
  const progress = `${activeLetterStep + 1} de ${letterSteps.length}`
  const photo = activePhoto()

  return `
    <main class="experience letter-screen">
      <div class="letter-backdrop" aria-hidden="true">
        ${photo ? `<img src="${asset(photo.src)}" alt="" />` : ''}
      </div>
      <section class="letter-shell" aria-labelledby="letter-title">
        ${renderPhotoPanel(step)}
        <article class="letter-paper">
          <div class="letter-progress">
            <span>${progress}</span>
            <div><i style="width: ${((activeLetterStep + 1) / letterSteps.length) * 100}%"></i></div>
          </div>
          <p class="eyebrow">Carta de William</p>
          <h1 id="letter-title">${step.title}</h1>
          <div class="letter-text">
            ${step.text.map((paragraph, index) => `<p style="--delay: ${index * 130}ms">${paragraph}</p>`).join('')}
          </div>
          <div class="letter-actions">
            <button class="ghost" type="button" data-action="prev-letter" ${activeLetterStep === 0 ? 'disabled' : ''}>Voltar</button>
            ${
              activeLetterStep === letterSteps.length - 1
                ? '<button type="button" data-action="finish-letter">Fechar carta</button>'
                : '<button type="button" data-action="next-letter">Continuar</button>'
            }
          </div>
        </article>
      </section>
      ${zoomOpen && photo ? renderZoom(photo, step.caption) : ''}
      ${immersiveOpen ? renderImmersive() : ''}
    </main>
  `
}

const renderClosing = () => {
  const closing = images.slice(0, 5)

  return `
    <main class="experience closing-screen">
      <section class="closing-card">
        <div class="closing-photos" aria-hidden="true">
          ${
            closing.length > 0
              ? closing
                  .map((item, index) => `<img class="closing-photo closing-${index + 1}" src="${asset(item.src)}" alt="" />`)
                  .join('')
              : '<span>Com gratidão</span>'
          }
        </div>
        <div class="closing-message">
          <p class="eyebrow">Com todo amor</p>
          <h1>Obrigado, Mãezinha Adriana</h1>
          <p>Que o Senhor continue abençoando sua vida, sua casa e todos os frutos do amor que você plantou.</p>
          <div class="letter-actions">
            <button type="button" data-action="review-letter">Rever carta</button>
            <button class="ghost" type="button" data-action="restart">Voltar ao começo</button>
          </div>
        </div>
      </section>
    </main>
  `
}

const renderZoom = (item: MediaItem, caption: string) => `
  <div class="zoom-layer" role="dialog" aria-modal="true" aria-label="Foto ampliada">
    <div class="zoom-toolbar">
      <button type="button" data-action="zoom-out">−</button>
      <span>${Math.round(zoomLevel * 100)}%</span>
      <button type="button" data-action="zoom-in">+</button>
      <button type="button" data-action="zoom-fit">Ajustar</button>
      <button type="button" data-action="close-zoom">Fechar</button>
    </div>
    <div class="zoom-frame ${zoomLevel > 1 ? 'is-zoomed' : ''}">
      <img src="${asset(item.src)}" alt="${escapeHtml(caption)}" style="--zoom: ${zoomLevel}" draggable="false" />
    </div>
  </div>
`

const renderImmersive = () => {
  const photo = activePhoto()
  if (!photo) return ''

  return `
    <div class="immersive-layer" role="dialog" aria-modal="true" aria-label="Foto em tela cheia">
      <div class="immersive-top">
        <button class="icon-button" type="button" data-action="close-immersive" aria-label="Sair da tela cheia">×</button>
      </div>
      <div class="immersive-stage">
        <img class="immersive-media" src="${asset(photo.src)}" alt="${escapeHtml(activeStep().caption)}" />
      </div>
    </div>
  `
}

const render = () => {
  if (screen === 'intro') app.innerHTML = renderIntro()
  if (screen === 'drumroll') app.innerHTML = renderDrumroll()
  if (screen === 'reveal') app.innerHTML = renderReveal()
  if (screen === 'letter') app.innerHTML = renderLetter()
  if (screen === 'closing') app.innerHTML = renderClosing()

  applyPendingZoomFocus()
}

const applyPendingZoomFocus = () => {
  if (!pendingZoomFocus) return

  const focus = pendingZoomFocus
  pendingZoomFocus = null
  window.requestAnimationFrame(() => {
    const frame = document.querySelector<HTMLElement>('.zoom-frame.is-zoomed')
    if (!frame) return

    frame.scrollLeft = frame.scrollWidth * focus.x - frame.clientWidth / 2
    frame.scrollTop = frame.scrollHeight * focus.y - frame.clientHeight / 2
  })
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const zoomFocusFromEvent = (event: MouseEvent, frame: HTMLElement) => {
  const image = frame.querySelector('img')
  const rect = image?.getBoundingClientRect() ?? frame.getBoundingClientRect()

  return {
    x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
    y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
  }
}

app.addEventListener('click', (event) => {
  const target = event.target
  if (!(target instanceof HTMLElement)) return

  const button = target.closest<HTMLButtonElement>('[data-action]')
  const zoomFrame = target.closest<HTMLElement>('.zoom-frame')
  if (!button && zoomFrame && zoomLevel <= 1) {
    pendingZoomFocus = zoomFocusFromEvent(event, zoomFrame)
    zoomLevel = 1.85
    render()
    return
  }

  if (!button) return

  const action = button.dataset.action

  if (action === 'start-surprise') {
    clearRevealTimer()
    screen = 'drumroll'
    render()
    getSound().playGiftReveal()
    revealTimer = window.setTimeout(() => {
      screen = 'reveal'
      revealTimer = null
      render()
    }, 7200)
  }

  if (action === 'open-letter') {
    activeLetterStep = 0
    screen = 'letter'
    render()
  }

  if (action === 'next-letter') moveLetter(1)
  if (action === 'prev-letter') moveLetter(-1)

  if (action === 'finish-letter') {
    zoomOpen = false
    zoomLevel = 1
    screen = 'closing'
    render()
  }

  if (action === 'review-letter') {
    activeLetterStep = 0
    screen = 'letter'
    render()
  }

  if (action === 'open-zoom' && activePhoto()) {
    zoomOpen = true
    zoomLevel = 1
    render()
  }

  if (action === 'close-zoom') {
    zoomOpen = false
    zoomLevel = 1
    render()
  }

  if (action === 'zoom-in') {
    pendingZoomFocus = { x: 0.5, y: 0.5 }
    zoomLevel = Math.min(zoomLevel + 0.25, 2.5)
    render()
  }

  if (action === 'zoom-out') {
    pendingZoomFocus = { x: 0.5, y: 0.5 }
    zoomLevel = Math.max(zoomLevel - 0.25, 1)
    render()
  }

  if (action === 'zoom-fit') {
    pendingZoomFocus = null
    zoomLevel = 1
    render()
  }

  if (action === 'open-immersive') openImmersive()
  if (action === 'close-immersive') closeImmersive()

  if (action === 'restart') {
    clearRevealTimer()
    closeImmersive(false)
    activeLetterStep = 0
    zoomOpen = false
    zoomLevel = 1
    screen = 'intro'
    render()
  }
})

app.addEventListener('pointerdown', (event) => {
  const target = event.target
  if (!(target instanceof HTMLElement)) return

  const frame = target.closest<HTMLElement>('.zoom-frame.is-zoomed')
  if (!frame) return

  panState = {
    frame,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    scrollLeft: frame.scrollLeft,
    scrollTop: frame.scrollTop,
  }
  frame.classList.add('is-panning')
  frame.setPointerCapture(event.pointerId)
})

app.addEventListener('pointermove', (event) => {
  if (!panState || panState.pointerId !== event.pointerId) return

  const dx = event.clientX - panState.startX
  const dy = event.clientY - panState.startY
  panState.frame.scrollLeft = panState.scrollLeft - dx
  panState.frame.scrollTop = panState.scrollTop - dy
})

const stopPanning = () => {
  panState?.frame.classList.remove('is-panning')
  panState = null
}

app.addEventListener('pointerup', stopPanning)
app.addEventListener('pointercancel', stopPanning)

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (immersiveOpen) {
      closeImmersive()
      return
    }

    if (zoomOpen) {
      zoomOpen = false
      zoomLevel = 1
      render()
      return
    }
  }

  if (screen !== 'letter') return
  if (event.key === 'ArrowRight') moveLetter(1)
  if (event.key === 'ArrowLeft') moveLetter(-1)
})

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && immersiveOpen) {
    immersiveOpen = false
    render()
  }
})

render()
getSound()
