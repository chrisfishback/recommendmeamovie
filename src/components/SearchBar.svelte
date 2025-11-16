<script>
	let inputValue = '';
</script>

<div class="search-bar">
	<input
		type="text"
		bind:value={inputValue}
		placeholder="Enter your preferences..."
		class="input"
	/>
	<button class="button">recommend me a movie</button>
</div>

<style>
	.search-bar {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		padding: 2rem;
	}

	.input {
		padding: 0.75rem 1rem;
		font-size: 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		width: 100%;
		max-width: 400px;
		transition: border-color 0.2s;
	}

	.input:focus {
		outline: none;
		border-color: #6366f1;
	}

	.button {
		padding: 0.75rem 2rem;
		font-size: 1rem;
		font-weight: 600;
		background-color: #6366f1;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.button:hover {
		background-color: #4f46e5;
	}

	.button:active {
		background-color: #4338ca;
	}
</style>

