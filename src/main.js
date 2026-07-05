import './style.css'
import { getContent, renderContent } from './content.js'
import { initScene } from './scene.js'
import { initAnimations } from './animations.js'

renderContent(getContent())
const sceneApi = initScene(document.getElementById('webgl'))
initAnimations(sceneApi)
