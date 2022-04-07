/**
 * A class where you can pass and manipulate how a callback is called
 * based on an interval.
 */
class Watcher {
	#callback = null;
	#ms = null;
	#intervalTimer = null;

	constructor(callback, ms) {
		this.#callback = callback;
		this.#ms = ms;
	}

	/**
	 * Activates this {@link Watcher} by setting an interval that will call
	 * the {@link callback} function every {@link ms} milliseconds.
	 *
	 * @param {boolean} doOnce If true, calls the {@link callback} function once
	 * on startup before setting the interval.
	 *
	 */
	activate(doOnce = false) {
		if (doOnce) {
			this.#callback();
		}

		const intervalTimer = setInterval(this.#callback, this.#ms);
		this.#intervalTimer = intervalTimer;
		return intervalTimer;
	}

	/**
	 * Deactivates this {@link Watcher}.
	 *
	 * @param {boolean} doOnce If true, calls the {@link callback} function once
	 * before deactivating the `Watcher`.
	 */
	deactivate(doOnce = false) {
		if (doOnce) {
			this.#callback();
		}

		clearInterval(this.#intervalTimer);
		return true;
	}

	get callback() {
		return this.#callback;
	}

	set callback(callback) {
		this.#callback = callback;
	}

	get ms() {
		return this.#ms;
	}

	set ms(ms) {
		this.#ms = ms;
	}

	get intervalTimer() {
		return this.#intervalTimer;
	}
}

export default Watcher;