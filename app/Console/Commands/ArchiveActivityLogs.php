<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ArchiveActivityLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'activity:archive {--days=90 : Archive logs older than this many days} {--dry-run : Show what would be archived without actually archiving}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Archive old activity logs to a separate table or file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = (int) $this->option('days');
        $dryRun = $this->option('dry-run');
        $cutoffDate = Carbon::now()->subDays($days);

        $this->info("Archiving activity logs older than {$days} days (before {$cutoffDate->format('Y-m-d H:i:s')})");

        // Count logs to be archived
        $count = ActivityLog::where('created_at', '<', $cutoffDate)->count();

        if ($count === 0) {
            $this->info('No logs to archive.');
            return 0;
        }

        $this->info("Found {$count} logs to archive.");

        if ($dryRun) {
            $this->warn('DRY RUN: No logs were actually archived.');
            return 0;
        }

        // Create archive table if it doesn't exist
        $this->createArchiveTableIfNotExists();

        // Archive logs in batches
        $bar = $this->output->createProgressBar($count);
        $bar->start();

        ActivityLog::where('created_at', '<', $cutoffDate)
            ->chunk(1000, function ($logs) use ($bar) {
                $this->archiveLogs($logs);
                $bar->advance($logs->count());
            });

        $bar->finish();
        $this->newLine();

        // Delete archived logs
        $deleted = ActivityLog::where('created_at', '<', $cutoffDate)->delete();
        
        $this->info("Successfully archived and deleted {$deleted} logs.");

        return 0;
    }

    /**
     * Create archive table if it doesn't exist
     */
    protected function createArchiveTableIfNotExists()
    {
        $tableName = 'activity_log_archive';
        
        if (!DB::getSchemaBuilder()->hasTable($tableName)) {
            DB::statement("
                CREATE TABLE {$tableName} (
                    id BIGINT UNSIGNED NOT NULL,
                    log_name VARCHAR(255) NULL,
                    description TEXT NOT NULL,
                    subject_type VARCHAR(255) NULL,
                    subject_id BIGINT UNSIGNED NULL,
                    event VARCHAR(255) NULL,
                    causer_type VARCHAR(255) NULL,
                    causer_id BIGINT UNSIGNED NULL,
                    properties JSON NULL,
                    batch_uuid CHAR(36) NULL,
                    created_at TIMESTAMP NULL,
                    updated_at TIMESTAMP NULL,
                    archived_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (id),
                    INDEX idx_log_name (log_name),
                    INDEX idx_created_at (created_at),
                    INDEX idx_archived_at (archived_at)
                )
            ");
            
            $this->info("Created archive table: {$tableName}");
        }
    }

    /**
     * Archive logs to archive table
     */
    protected function archiveLogs($logs)
    {
        $archiveData = $logs->map(function ($log) {
            return [
                'id' => $log->id,
                'log_name' => $log->log_name,
                'description' => $log->description,
                'subject_type' => $log->subject_type,
                'subject_id' => $log->subject_id,
                'event' => $log->event,
                'causer_type' => $log->causer_type,
                'causer_id' => $log->causer_id,
                'properties' => $log->properties ? json_encode($log->properties) : null,
                'batch_uuid' => $log->batch_uuid,
                'created_at' => $log->created_at,
                'updated_at' => $log->updated_at,
                'archived_at' => now(),
            ];
        })->toArray();

        if (!empty($archiveData)) {
            DB::table('activity_log_archive')->insert($archiveData);
        }
    }
}
