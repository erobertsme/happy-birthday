import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// CSS dvh/svh units aren't supported on Firefox for Android before v150, and
// Firefox for Android has separate known bugs with position:fixed not
// accounting for its own toolbar height. window.innerHeight is universally
// supported and reflects the real visible height, so drive layout from it
// instead of viewport units.
const setViewportHeightVar = () => {
	document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
};
setViewportHeightVar();
window.addEventListener('resize', setViewportHeightVar);
window.addEventListener('orientationchange', setViewportHeightVar);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
