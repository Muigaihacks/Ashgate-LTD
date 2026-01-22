<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    /**
     * Get published news articles
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        
        $articles = NewsArticle::with('author')
            ->where('status', 'published')
            ->where('published_at', '<=', now())
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);

        $articlesData = $articles->map(function ($article) {
            return [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'excerpt' => $article->excerpt,
                'content' => $article->content,
                'featured_image' => $article->featured_image 
                    ? (str_starts_with($article->featured_image, 'http') 
                        ? $article->featured_image 
                        : asset('storage/' . $article->featured_image))
                    : null,
                'category' => $article->category,
                'date' => $article->published_at?->format('M d, Y'),
                'author' => $article->author?->name ?? 'Ashgate Team',
                'view_count' => $article->view_count,
            ];
        });

        return response()->json([
            'data' => $articlesData,
            'pagination' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'per_page' => $articles->perPage(),
                'total' => $articles->total(),
            ]
        ]);
    }

    /**
     * Get a single news article
     */
    public function show($slug)
    {
        $article = NewsArticle::with('author')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->where('published_at', '<=', now())
            ->firstOrFail();

        // Increment view count
        $article->increment('view_count');

        return response()->json([
            'data' => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'excerpt' => $article->excerpt,
                'content' => $article->content,
                'featured_image' => $article->featured_image 
                    ? (str_starts_with($article->featured_image, 'http') 
                        ? $article->featured_image 
                        : asset('storage/' . $article->featured_image))
                    : null,
                'category' => $article->category,
                'date' => $article->published_at?->format('M d, Y'),
                'author' => $article->author?->name ?? 'Ashgate Team',
                'view_count' => $article->view_count,
            ]
        ]);
    }
}
