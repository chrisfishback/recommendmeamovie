<script>
	import { client } from '../lib/appwrite.js';
	import { Databases, Query } from 'appwrite';

	let inputValue = '';
	let loading = false;
	let movies = [];
	let error = null;

	const databases = new Databases(client);
	const DATABASE_ID = import.meta.env.PUBLIC_APPWRITE_DATABASE_ID;
	const COLLECTION_ID = import.meta.env.PUBLIC_APPWRITE_COLLECTION_ID || 'movies';

	async function searchMovies() {
		if (!inputValue.trim()) {
			error = 'Please enter a search term';
			return;
		}

		loading = true;
		error = null;
		movies = [];

		try {
			const response = await databases.listDocuments(
				DATABASE_ID,
				COLLECTION_ID,
				[Query.search('title', inputValue)]
			);

			movies = response.documents;
			
			if (movies.length === 0) {
				error = 'No movies found. Try a different search term.';
			}
		} catch (err) {
			error = `Error searching movies: ${err.message}`;
			console.error('Search error:', err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="search-bar">
	<input
		type="text"
		bind:value={inputValue}
		placeholder="Enter your preferences..."
		class="input"
		disabled={loading}
		on:keydown={(e) => e.key === 'Enter' && searchMovies()}
	/>
	<button class="button" on:click={searchMovies} disabled={loading}>
		{loading ? 'Searching...' : 'recommend me a movie'}
	</button>

	{#if error}
		<div class="error">{error}</div>
	{/if}

	{#if movies.length > 0}
		<div class="results">
			<h3>Found {movies.length} movie{movies.length !== 1 ? 's' : ''}:</h3>
			<div class="movies-list">
				{#each movies as movie}
					<div class="movie-card">
						{#if movie.poster_path}
							<img
								src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
								alt={movie.title}
								class="poster"
							/>
						{/if}
						<div class="movie-info">
							<h4>{movie.title}</h4>
							{#if movie.release_date}
								<p class="release-date">{movie.release_date}</p>
							{/if}
							{#if movie.overview}
								<p class="overview">{movie.overview}</p>
							{/if}
							{#if movie.genres}
								<p class="genres">{movie.genres}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
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

	.button:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
	}

	.error {
		color: #ef4444;
		padding: 1rem;
		background-color: #fee2e2;
		border-radius: 8px;
		width: 100%;
		max-width: 400px;
		text-align: center;
	}

	.results {
		width: 100%;
		max-width: 800px;
		margin-top: 2rem;
	}

	.results h3 {
		margin-bottom: 1rem;
		color: #1f2937;
	}

	.movies-list {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	}

	.movie-card {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		background-color: #f9fafb;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
		transition: box-shadow 0.2s;
	}

	.movie-card:hover {
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.poster {
		width: 100px;
		height: 150px;
		object-fit: cover;
		border-radius: 4px;
		flex-shrink: 0;
	}

	.movie-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.movie-info h4 {
		margin: 0;
		color: #1f2937;
		font-size: 1.125rem;
		font-weight: 600;
	}

	.release-date {
		margin: 0;
		color: #6b7280;
		font-size: 0.875rem;
	}

	.overview {
		margin: 0;
		color: #4b5563;
		font-size: 0.875rem;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.genres {
		margin: 0;
		color: #6366f1;
		font-size: 0.875rem;
		font-weight: 500;
	}
</style>

