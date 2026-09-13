// Combines share settings into a single obfuscated query param

const MAX_CLICKS_FLAG = 0b001;
const URL_FLAG = 0b010;
const NAME_FLAG = 0b100;

const stripUrlPrefix = url => url.replace(/^https?:\/\//i, '').replace(/^www\./i, '');

const toBase64Url = bytes => {
	let binary = '';
	bytes.forEach(byte => {
		binary += String.fromCharCode(byte);
	});
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = str => {
	const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
	const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
	const binary = atob(padded);
	return Uint8Array.from(binary, char => char.charCodeAt(0));
};

export const encodeShareOptions = ({ url, maxClicks, name }) => {
	const maxClicksChanged = maxClicks && Number(maxClicks) !== 5;
	const urlSet = Boolean(url);
	const nameSet = Boolean(name);

	if (!maxClicksChanged && !urlSet && !nameSet) return null;

	let flags = 0;
	if (maxClicksChanged) flags |= MAX_CLICKS_FLAG;
	if (urlSet) flags |= URL_FLAG;
	if (nameSet) flags |= NAME_FLAG;

	const bytes = [flags];

	if (maxClicksChanged) bytes.push(Math.min(255, Math.max(0, Number(maxClicks))));

	if (nameSet) {
		const nameBytes = new TextEncoder().encode(name);
		bytes.push(Math.min(255, nameBytes.length), ...nameBytes.slice(0, 255));
	}

	if (urlSet) bytes.push(...new TextEncoder().encode(stripUrlPrefix(url)));

	return toBase64Url(bytes);
};

export const decodeShareOptions = data => {
	const result = {};
	if (!data) return result;

	try {
		const bytes = fromBase64Url(data);
		const flags = bytes[0];
		let index = 1;

		if (flags & MAX_CLICKS_FLAG) {
			result.maxClicks = bytes[index];
			index += 1;
		}

		if (flags & NAME_FLAG) {
			const nameLength = bytes[index];
			index += 1;
			result.name = new TextDecoder().decode(bytes.slice(index, index + nameLength));
			index += nameLength;
		}

		if (flags & URL_FLAG) {
			result.url = `https://${new TextDecoder().decode(bytes.slice(index))}`;
		}
	} catch {
		// Something went wrong. Bail out.
	}

	return result;
};
