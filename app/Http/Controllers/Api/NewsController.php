<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
                'content' => $this->rewriteContentStorageUrls($article->content),
                'featured_image' => $article->featured_image 
                    ? (str_starts_with($article->featured_image, 'http') 
                        ? $article->featured_image 
                        : Storage::disk(config('filesystems.default'))->url($article->featured_image))
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
                'content' => $this->rewriteContentStorageUrls($article->content),
                'featured_image' => $article->featured_image 
                    ? (str_starts_with($article->featured_image, 'http') 
                        ? $article->featured_image 
                        : Storage::disk(config('filesystems.default'))->url($article->featured_image))
                    : null,
                'category' => $article->category,
                'date' => $article->published_at?->format('M d, Y'),
                'author' => $article->author?->name ?? 'Ashgate Team',
                'view_count' => $article->view_count,
            ]
        ]);
    }

    /**
     * Rewrite relative storage paths in HTML content to full default-disk URLs (e.g. R2).
     * Handles img src like "/storage/news-content/..." or "news-content/..." so they work when default disk is R2.
     */
    private function rewriteContentStorageUrls(?string $content): ?string
    {
        if ($content === null || $content === '') {
            return $content;
        }

        $disk = Storage::disk(config('filesystems.default'));

        return preg_replace_callback(
            '/<img([^>]+)src=["\']([^"\']+)["\']([^>]*)>/i',
            function ($matches) use ($disk) {
                $before = $matches[1];
                $src = $matches[2];
                $after = $matches[3];
                if (str_starts_with($src, 'http://') || str_starts_with($src, 'https://')) {
                    return $matches[0];
                }
                $path = preg_replace('#^/storage/#', '', $src);
                $url = $disk->url($path);
                return '<img' . $before . 'src="' . $url . '"' . $after . '>';
            },
            $content
        );
    }
}
