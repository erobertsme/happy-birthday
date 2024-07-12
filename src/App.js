import './styles.css';
import React, { useState, useEffect, useRef } from 'react';
import { useReward } from 'react-rewards';

const url = 'aHR0cHM6Ly90cnVzdG1ldGhpc2lzbm90YXNjYW0uY29t';
const totalClicks = 5;

const config = {
	emoji: ['🎈', '🎊', '🎉', '🎁', '⭐'],
	elementCount: 100,
	spread: 150,
	zIndex: 9999,
	lifetime: 300,
};

// Make non-🎈 emoji more rare
for (let i = 0; i < 25; i++) {
	config.emoji.push('🎈');
}


const App = () => {
	const [count, setCount] = useState(0);
	const [cakes, setCakes] = useState([]);
    const [name, setName] = useState('');
	const { reward } = useReward('rewardId', 'emoji', config);
    const h2Ref = useRef(null);

	useEffect(() => {
		addCake();
    
        const getQueryParam = (name) => {
			const urlParams = new URLSearchParams(window.location.search);
			return urlParams.get(name);
		};

		const queryParamName = getQueryParam('name');
		if (queryParamName) {
			setName(queryParamName);
		}
	}, []);

	useEffect(() => {
		if (count > 1) {
			h2Ref.current.classList.add('bounce');
			setTimeout(() => {
				h2Ref.current.classList.remove('bounce');
			}, 1000);
		}
	}, [count]);

	const addCake = () => {
		setCakes((prevCakes) => ['🎂', ...prevCakes]);
        increaseCount();
        reward();
	};

	const increaseCount = () => {
		setCount((prevCount) => prevCount + 1);
	};

	const handleClick = () => {
		if (count > totalClicks - 1) {
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
					{name && <><br/>{name}</>}
				</button>
				<h2 ref={h2Ref}>{count < 2 ? 'Click the button!' : 'Keep Going!'}</h2>
				<div className="cake">{cakes.join('')}</div>
			</div>
		</div>
	);
};

export default App;
