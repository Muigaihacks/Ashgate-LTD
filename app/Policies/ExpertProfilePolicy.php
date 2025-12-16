<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ExpertProfile;
use Illuminate\Auth\Access\HandlesAuthorization;

class ExpertProfilePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_expert::profile');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ExpertProfile $expertProfile): bool
    {
        return $user->can('view_expert::profile');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_expert::profile');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ExpertProfile $expertProfile): bool
    {
        return $user->can('update_expert::profile');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ExpertProfile $expertProfile): bool
    {
        return $user->can('delete_expert::profile');
    }

    /**
     * Determine whether the user can bulk delete.
     */
    public function deleteAny(User $user): bool
    {
        return $user->can('delete_any_expert::profile');
    }

    /**
     * Determine whether the user can permanently delete.
     */
    public function forceDelete(User $user, ExpertProfile $expertProfile): bool
    {
        return $user->can('force_delete_expert::profile');
    }

    /**
     * Determine whether the user can permanently bulk delete.
     */
    public function forceDeleteAny(User $user): bool
    {
        return $user->can('force_delete_any_expert::profile');
    }

    /**
     * Determine whether the user can restore.
     */
    public function restore(User $user, ExpertProfile $expertProfile): bool
    {
        return $user->can('restore_expert::profile');
    }

    /**
     * Determine whether the user can bulk restore.
     */
    public function restoreAny(User $user): bool
    {
        return $user->can('restore_any_expert::profile');
    }

    /**
     * Determine whether the user can replicate.
     */
    public function replicate(User $user, ExpertProfile $expertProfile): bool
    {
        return $user->can('replicate_expert::profile');
    }

    /**
     * Determine whether the user can reorder.
     */
    public function reorder(User $user): bool
    {
        return $user->can('reorder_expert::profile');
    }
}
