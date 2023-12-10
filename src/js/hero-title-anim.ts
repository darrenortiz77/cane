/**
 * Animates the main hero banner title so each word staggers on.
 * Animation itself is done via CSS. This just controls the delay between words.
 */
class HeroTitleAnim {
	private words: string[];

	constructor(private elm: HTMLElement) {
		this.words = this.elm.innerHTML.replace(/[\t\n\r]/g, '').split(' ');

		this.elm.innerHTML = '';

		let delay = 300;
		this.words.forEach((word, i) => {
			const span = document.createElement('span');
			span.innerHTML = i > 0 ? ` ${word}` : word;
			span.style.transitionDelay = `${delay}ms`;

			// special consideration for the emphasized word
			const em = span.querySelector('em');
			if (em) {
				em.style.animationDelay = `${delay + 700}ms`;
			}

			this.elm.append(span);

			// extra delay if there's a comma
			delay += word.indexOf(',') !== -1 ? 400 : 200;
		});

		setTimeout(() => {
			this.elm.classList.add('anim');
		}, 0);
	}
}

const elm = document.querySelector<HTMLElement>('.js-hero-title');
if (elm) {
	new HeroTitleAnim(elm);
}

export default HeroTitleAnim;
