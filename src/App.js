import './styles.css';
import React, { useState, useEffect, useRef } from 'react';
import { useReward } from 'react-rewards';

const maxClicks = 5;

const config = {
	emoji: ['🎈', '🎊', '🎉', '🎁', '⭐'],
	elementCount: 100,
	spread: 150,
	zIndex: 42069,
	lifetime: 300,
};

// Make non-🎈 emoji more rare
for (let i = 0; i < 25; i++) {
	config.emoji.push('🎈');
}

const App = () => {
    const [url, setUrl] = useState('aHR0cHM6Ly90cnVzdG1ldGhpc2lzbm90YXNjYW0uY29t');
	const [count, setCount] = useState(0);
	const [cakes, setCakes] = useState([]);
	const [name, setName] = useState('');
	const { reward } = useReward('rewardId', 'emoji', config);
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
        // Get name (plain text)
		const queryParamName = getQueryParam('name');
		if (queryParamName) {
			setName(queryParamName);
		}

        // Get obfuscated name (base64 encoded)
        const queryParamBd = getQueryParam('bd');
		if (!queryParamBd) return;

        setName(atob(queryParamBd));
    }

    // Get surprise URL
    const getSurpriseUrl = () => {
        const queryParamUrl = getQueryParam('rw');
        if (!queryParamUrl) return;

        setUrl(queryParamUrl);
    }

    // Setup page
	useEffect(() => {
		addCake();
		setBirthdayName();
        getSurpriseUrl();
	}, []);

    // Animate "Click button"
	useEffect(() => {
		if (count < 2) return;

        bounceElement(h2Ref);
	}, [count]);

	const addCake = () => {
		setCakes(prevCakes => ['🎂', ...prevCakes]);
		increaseCount();
		reward();
	};

	const increaseCount = () => {
		setCount(prevCount => prevCount + 1);
	};

	const handleClick = () => {
		if (count > maxClicks - 1) {
			window.open(atob(url), '_blank');
			setCount(0);
			return;
		}

		addCake();
	};

	return (
		<div className="wrapper">
			<div className="reward-container">
				<button className="happy" onClick={handleClick} id="rewardId">
					Happy Birthday
                    <br />
                    {name}
				</button>
				<h2 ref={h2Ref}>
					{count < 2 ? 'Click the button!' : 'Keep Going!'}
				</h2>
				<div className="cake">{cakes.join('')}</div>
			</div>
		</div>
	);
};

export default App;
