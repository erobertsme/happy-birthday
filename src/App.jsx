import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import party from 'party-js';
import ShareButton from './ShareButton';
import { decodeShareOptions } from './linkUtils';

party.settings.zIndex = 42069;
party.settings.gravity = 200;

const emojiList = ['🎈', '🎉', '🎁'];

for (const emoji of emojiList) {
	party.resolvableShapes[emoji] = `<span>${emoji}</span>`;
}

const birthdaySettings = {
	count: 100,
	spread: 300,
	shapes: ['rectangle', 'circle', 'star', ...emojiList],
};

const defaultUrl = atob('aHR0cHM6Ly90cnVzdG1ldGhpc2lzbm90YXNjYW0uY29t');

const App = () => {
	const [url, setUrl] = useState(defaultUrl);
	const [currentClicks, setCurrentClicks] = useState(0);
    const [maxClicks, setMaxClicks] = useState(5);
	const [cakes, setCakes] = useState('');
	const [name, setName] = useState('');

	const buttonRef = useRef(null);
	const h2Ref = useRef(null);

	const bounceElement = ref => {
		ref.current.classList.add('bounce');
		setTimeout(() => {
			ref.current.classList.remove('bounce');
		}, 1000);
	}

	const getQueryParam = name => {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(name);
	};

	const setBirthdayName = () => {
		// Get name (plain text) - a hidden name arrives via the "d" param instead
		const queryParamName = getQueryParam('name');
		if (queryParamName) setName(queryParamName);
	}

	// Get the redirect URL, max clicks, and (if hidden) the name, all packed
	// together into the "d" param
	const applyShareOptions = () => {
		const { url: sharedUrl, maxClicks: sharedMaxClicks, name: sharedName } = decodeShareOptions(getQueryParam('d'));
		if (sharedUrl) setUrl(sharedUrl);
		if (sharedMaxClicks !== undefined) setMaxClicks(sharedMaxClicks);
		if (sharedName) setName(sharedName);
	}

	const activateSurprise = () => {
		window.open(url, '_blank');
		setCakes('🎂');
		setCurrentClicks(0);
	}

	// Setup page
	useEffect(() => {
        setBirthdayName();
		applyShareOptions();
		setCakes('🎂');
	}, []);

	// Animate "Click button"
	useEffect(() => {
		if (currentClicks > 1) bounceElement(h2Ref);
	}, [currentClicks]);

	const handleClick = () => {
		if (currentClicks >= maxClicks) return activateSurprise();

		setCurrentClicks(prevCount => prevCount + 1);
		setCakes(prevCakes => prevCakes + '🎂');
		party.confetti(buttonRef.current, birthdaySettings);
		party.sparkles(buttonRef.current);
	};

	return (
		<div className="wrapper">
			<div className="reward-container">
				<button className="happy" onClick={handleClick} ref={buttonRef}>
					Happy Birthday
					<br />
					{name}
				</button>
				<h2 ref={h2Ref}>
					{currentClicks < 2 ? 'Click the button ⤴' : 'Keep Going!'}
				</h2>
				<div className="cakes">{cakes}</div>
                <ShareButton />
			</div>
		</div>
	);
};

export default App;