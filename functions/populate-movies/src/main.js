import { Client, Databases, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
  const COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID;

  try {
    log('Starting to fetch movies from TMDB...');

    // Fetch popular movies from TMDB (you can change this to different endpoints)
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    
    const data = await response.json();
    const movies = data.results;

    log(`Fetched ${movies.length} movies from TMDB`);

    let insertedCount = 0;
    let skippedCount = 0;

    // Insert each movie into Appwrite
    for (const movie of movies) {
      try {
        // Check if movie already exists
        const existing = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [Query.equal('tmdb_id', movie.id)]
        );

        if (existing.documents.length > 0) {
          log(`Movie "${movie.title}" already exists, skipping...`);
          skippedCount++;
          continue;
        }

        // Fetch genre names (TMDB returns genre IDs)
        const genresResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}`
        );
        const movieDetails = await genresResponse.json();
        const genreNames = movieDetails.genres.map(g => g.name).join(', ');

        // Insert movie
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          'unique()', // Auto-generate ID
          {
            tmdb_id: movie.id,
            title: movie.title,
            overview: movie.overview || '',
            poster_path: movie.poster_path || '',
            release_date: movie.release_date || '',
            vote_average: movie.vote_average || 0,
            genres: genreNames
          }
        );

        log(`Inserted: ${movie.title}`);
        insertedCount++;

      } catch (err) {
        error(`Error inserting ${movie.title}: ${err.message}`);
      }
    }

    return res.json({
      success: true,
      message: `Inserted ${insertedCount} movies, skipped ${skippedCount} duplicates`,
      insertedCount,
      skippedCount
    });

  } catch (err) {
    error(`Function error: ${err.message}`);
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};
